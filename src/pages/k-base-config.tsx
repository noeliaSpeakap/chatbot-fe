import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { FormProvider, useForm } from "react-hook-form";
import { FormItem, FormLabel } from "../components/ui/form";
import {
  useFetchKnowledgeBases,
  useGetPresignedUrl,
  useSyncPinecone,
} from "../api/index";
import KnowledgeBaseCombobox from "./knowledge-base-config/knowledge-base-combobox";

const KBaseConfig: React.FC = () => {
  const methods = useForm();
  const { handleSubmit, control } = methods;
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const {
    data: knowledgeBases = [],
    isLoading,
    isError,
  } = useFetchKnowledgeBases();
  const { mutateAsync: getPresignedUrl } = useGetPresignedUrl();
  const syncPineconeMutation = useSyncPinecone();

  const onSubmit = async (data: any) => {
    const selectedFolderName = data.kbase;
    try {
      if (!selectedFolderName || uploadedFiles.length === 0) {
        alert(
          "Please select a knowledge base and upload at least one document."
        );
        return;
      }

      for (const file of uploadedFiles) {
        const presignedResponse = await getPresignedUrl({
          fileName: file.name,
          fileType: file.type,
          kBaseId: selectedFolderName,
        });

        if (!presignedResponse.uploadUrl) {
          throw new Error("Failed to get presigned URL");
        }

        const { uploadUrl } = presignedResponse;
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error(
            `Failed to upload file: ${file.name}. Error: ${errorText}`
          );
          throw new Error(
            `Failed to upload file: ${file.name}. Error: ${errorText}`
          );
        }
        syncPineconeMutation.mutate({ kBaseId: selectedFolderName });
      }

      alert("File(s) uploaded successfully");
    } catch (error: any) {
      console.error("Error uploading file(s):", error);
      alert(`Error uploading file(s): ${error.message}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      console.log("Uploaded files:", filesArray);
      setUploadedFiles(filesArray);
      setFileNames(filesArray.map((file) => file.name));
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          Knowledge Base Configuration
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <KnowledgeBaseCombobox
            control={control}
            name="kbase"
            label="Knowledge Base"
            knowledgeBases={knowledgeBases}
            isLoading={isLoading}
            isError={isError}
          />

          <FormItem className="mt-6">
            <FormLabel>PDF Documents</FormLabel>
            <Input
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileUpload}
              className="mt-2"
            />
            {fileNames.length > 0 && (
              <ul className="mt-2">
                {fileNames.map((fileName, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {fileName}
                  </li>
                ))}
              </ul>
            )}
          </FormItem>

          <div className="mt-4">
            <Button type="submit">Add content</Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default KBaseConfig;
