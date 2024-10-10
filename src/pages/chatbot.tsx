import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import KnowledgeBaseCombobox from "./knowledge-base-config/knowledge-base-combobox";
import { useForm, FormProvider } from "react-hook-form";
import { useFetchKnowledgeBases, useSendMessage } from "@/api";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [currentMessage, setCurrentMessage] = useState("");
  const methods = useForm();
  const { control, watch } = methods;
  const selectedKBaseId = watch("kbase");

  const {
    data: knowledgeBases = [],
    isLoading,
    isError,
  } = useFetchKnowledgeBases();

  const sendMessageMutation = useSendMessage();

  const handleSendMessage = async () => {
    if (currentMessage.trim() === "" || !selectedKBaseId) return;

    const newMessages = [...messages, { sender: "User", text: currentMessage }];
    setMessages(newMessages);
    setCurrentMessage("");

    sendMessageMutation.mutate(
      { selectedKbaseId: selectedKBaseId, currentMessage, newMessages },
      {
        onSuccess: (data) => {
          const assistantMessage =
            data.answer || "Sorry, I couldn't find the answer.";
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "Assistant", text: assistantMessage },
          ]);
        },
        onError: (error) => {
          console.error("Error:", error);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              sender: "Assistant",
              text: "Something went wrong. Please try again later.",
            },
          ]);
        },
      }
    );
  };

  return (
    <FormProvider {...methods}>
      {" "}
      <div className="p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Chatbot</h2>

        {/* Combobox */}
        <KnowledgeBaseCombobox
          control={control}
          name="kbase"
          label="Knowledge Base"
          knowledgeBases={knowledgeBases}
          isLoading={isLoading}
          isError={isError}
        />

        {/* Chat History */}
        <div className="border p-4 mb-4 h-64 overflow-y-auto bg-gray-100">
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages yet.</p>
          ) : (
            messages.map((message, index) => (
              <div key={index} className="mb-2">
                <strong>{message.sender}: </strong>
                <span>{message.text}</span>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            className="flex-grow"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !selectedKBaseId}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};

export default Chatbot;
