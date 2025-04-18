import PageHeadingWithMetaAndActions
	, {
	PageHeadingActionButtonProps
} from "@/Components/PageHeadingWithMetaAndActions/PageHeadingWithMetaAndActions";
import PageContentSection from "@/Components/PageContentSection";
import React, {Suspense} from "react";
import NewItemFormDialog from "@/Components/NewItemFormDialog";
import NewProjectForm from "@/Components/Project/NewProjectForm/NewProjectForm";
import NewRecordTemplateForm
	from "@/Components/FormTemplate/NewRecordTemplateForm/NewRecordTemplateForm";
import RecordTemplatesCell from "@/Pages/FormTemplatesPage/RecordTemplatesCell";
import TableWithHeaderLoadingSkeleton
	from "@/Components/Loading/Skeletons/TableWithHeaderLoadingSkeleton";

const newRecordPageActions: PageHeadingActionButtonProps[] = [
	{
		dialog: <NewItemFormDialog form={<NewRecordTemplateForm/>}
								   label={"New Form Template"}
								   triggerLabel={"New Form Template"}
								   description={"Create a new record template"}
		/>
	},
];
export default function RecordTemplatesPage() {
	return (
		<>
			<PageHeadingWithMetaAndActions actions={newRecordPageActions}
										   pageHeading={"Form Templates"}
										   subHeading={"Manage form templates"}
			/>
			<PageContentSection>
				<Suspense fallback={<TableWithHeaderLoadingSkeleton/>}>
					<RecordTemplatesCell/>
				</Suspense>
			</PageContentSection>
		</>
	)
}
