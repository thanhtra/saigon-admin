
import { CollaboratorInput } from "@/common/type";
import { post } from "@/utils/request";
import { useCallback, useState } from "react";

const useCreateCollaborator = () => {
	const [loading, setLoading] = useState(false);

	const createCollaborator = useCallback(async (body: CollaboratorInput) => {
		setLoading(true);

		try {
			const res = await post("/collaborator", body);
			return res;
		} catch (error) {
			console.error(error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	return { createCollaborator, loading };
};

export default useCreateCollaborator;
