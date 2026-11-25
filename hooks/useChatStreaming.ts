import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  RefObject,
} from "react";
import { type AiModel } from "@/lib/drizzle/schema";
import { toast } from "sonner";

export function useChatStreaming(
  currentConversationId: RefObject<string | null>
): {
  isStopping: boolean;
  setIsStopping: (value: boolean) => void;
  abortControllerRef: RefObject<AbortController | null>;
  streamingModelRef: RefObject<string | null>;
  savePartialResponseAndStop: (stop: () => void) => Promise<void>;
  createNewAbortController: () => void;
  captureStreamingModel: (model: AiModel) => void;
} {
  const [isStopping, setIsStopping] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingModelRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const savePartialResponseAndStop = useCallback(
    async (stop: () => void): Promise<void> => {
      if (!currentConversationId.current) return;

      setIsStopping(true);

      try {
        stop();
      } catch (error) {
        console.error("Error stopping stream:", error);
        toast.error("Error stopping stream");
      }
    },
    [currentConversationId]
  );

  const createNewAbortController = useCallback((): void => {
    abortControllerRef.current = new AbortController();
  }, []);

  const captureStreamingModel = useCallback((model: AiModel): void => {
    streamingModelRef.current = model.id;
  }, []);

  return useMemo(
    () => ({
      isStopping,
      setIsStopping,
      abortControllerRef,
      streamingModelRef,
      savePartialResponseAndStop,
      createNewAbortController,
      captureStreamingModel,
    }),
    [
      isStopping,
      savePartialResponseAndStop,
      createNewAbortController,
      captureStreamingModel,
    ]
  );
}
