import { post } from "@/utils/apiClient";
import { Collaborator } from "@/utils/type";
import { useCallback } from "react";

const useCreateCollaborator = () => {
	const createCollaborator = useCallback(async (body: Collaborator) => {
		try {
			const res = await post("/collaborator", body);
			return res;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}, []);

	return { createCollaborator };
};

export default useCreateCollaborator;
