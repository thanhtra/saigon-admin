import { post } from "@/utils/apiClient";
import { TopicInput } from "@/utils/type";
import { useCallback } from "react";

const useCreateTopic = () => {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const createTopic = useCallback(async (body: TopicInput) => {
		try {
			const topic = await post("/topic", body);
			return topic;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}, []);

	return { createTopic };
};

export default useCreateTopic;
