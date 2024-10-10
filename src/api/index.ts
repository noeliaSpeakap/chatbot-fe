import { useQuery, useMutation, UseQueryResult, UseMutationResult } from "@tanstack/react-query";

const apiUrl = "https://z1sqy7vj6k.execute-api.us-east-1.amazonaws.com/Prod";

export const fetcher = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  try {
    const response = await fetch(`${apiUrl}${url}`, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Network response was not ok, status: ${response.statusText} (${response.status}), body: ${errorText}`
      );
    }
    return response.json();
  } catch (error) {
    console.error("Fetcher error:", error);
    throw error;
  }
};

export interface PresignedUrlResponse {
  uploadUrl: string;
}

export const useFetchKnowledgeBases = (): UseQueryResult<string[]> => {
  return useQuery<string[]>({
    queryKey: ["list-knowledge-bases"],
    queryFn: () => fetcher<string[]>("/list-knowledge-bases/"),
  });
};

export const useGetPresignedUrl = (): UseMutationResult<PresignedUrlResponse, Error, { fileName: string; fileType: string; kBaseId: string }> => {
    return useMutation<PresignedUrlResponse, Error, { fileName: string; fileType: string; kBaseId: string }>({
      mutationFn: (body: any) =>
        fetcher<PresignedUrlResponse>("/add-document-to-kb/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body),
        })
    });
};

interface ChatbotResponse {
  message: string;
}
export const useSyncPinecone = (): UseMutationResult<ChatbotResponse, Error, { kBaseId: string }> => {
  return useMutation<ChatbotResponse, Error, { kBaseId: string }>({
    mutationFn: (body) =>
      fetcher<ChatbotResponse>("/vectorize-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kBaseId: body.kBaseId, 
        }),
      }),
  });
};


interface ChatbotResponse {
  answer: string;
}

interface SendMessageVariables {
  selectedKbaseId: string;
  currentMessage: string;
  newMessages: { sender: string; text: string }[];
}

export const useSendMessage = (): UseMutationResult<
  ChatbotResponse,
  Error,
  SendMessageVariables
> => {
  return useMutation<ChatbotResponse, Error, SendMessageVariables>({
    mutationFn: async ({ selectedKbaseId, currentMessage, newMessages }) => {
      const response = await fetcher<ChatbotResponse>("/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kBaseId: selectedKbaseId,
          question: currentMessage,
          history: newMessages.map((msg) => msg.text),
        }),
      });

      if (!response) {
        throw new Error("Failed to send message");
      }

      return response;
    },
  });
};
