import { CollaboratorType, FieldCooperation } from "@/common/enum";
import { CollaboratorTypeForm } from "@/types";

export const COLLABORATOR_DEFAULT_VALUES: CollaboratorTypeForm = {
    user_id: '',
    type: CollaboratorType.Broker,
    field_cooperation: FieldCooperation.Undetermined,
    note: '',
    active: true,
    is_confirmed_ctv: false
};