"use client";

import {ElementsType, FormElement, FormElementInstance, SubmitFunction} from "form-types";
import {Label} from "@/Primitives/Label";
import {Input} from "@/Primitives/Input";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import useDesigner from "@/Hooks/useDesigner";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/Primitives/Form";
import {Switch} from "@/Primitives/Switch";
import {cn} from "@/Lib/utils";
import {BsTextareaResize} from "react-icons/bs";
import {Textarea} from "@/Primitives/TextArea";
import {Slider} from "@/Primitives/Slider";
import {
	TextAreaCustomInstance,
	TextAreaExtraAttributes, TextAreaPropertiesFormSchemaType,
	TextAreaPropertiesSchema
} from "form-types/TextAreaField";

const type: ElementsType = "TextAreaField";

export const TextAreaFormElement: FormElement = {
	type,
	construct: (id: string) => ({
		id,
		type,
		extraAttributes: TextAreaExtraAttributes
	}),
	designerBtnElement: {
		icon: BsTextareaResize,
		label: "TextArea Field",
	},
	designerComponent: DesignerComponent,
	formComponent: FormComponent,
	propertiesComponent: PropertiesComponent,

	validate: (formElement: FormElementInstance, currentValue: string): boolean => {
		const element = formElement as TextAreaCustomInstance;
		if (element.extraAttributes.required) {
			return currentValue.length > 0;
		}

		return true;
	},
};

function DesignerComponent({elementInstance}: { elementInstance: FormElementInstance }) {
	const element = elementInstance as TextAreaCustomInstance;
	const {label, required, placeHolder, helperText, rows} = element.extraAttributes;
	return (
		<div className="flex flex-col gap-2 w-full">
			<Label>
				{label}
				{required && "*"}
			</Label>
			<Input className={'h-12'} readOnly disabled placeholder={placeHolder}/>
			{helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>}
		</div>
	);
}

function FormComponent({
						   elementInstance,
						   submitValue,
						   isInvalid,
						   defaultValue,
					   }: {
	elementInstance: FormElementInstance;
	submitValue?: SubmitFunction;
	isInvalid?: boolean;
	defaultValue?: string;
}) {
	const element = elementInstance as TextAreaCustomInstance;

	const [value, setValue] = useState(defaultValue || "");
	const [error, setError] = useState(false);

	useEffect(() => {
		setError(isInvalid === true);
	}, [isInvalid]);

	const {label, required, placeHolder, helperText, rows} = element.extraAttributes;
	return (
		<div className="flex flex-col gap-2 w-full">
			<Label className={cn(error && "text-red-500")}>
				{label}
				{required && "*"}
			</Label>
			<Textarea
				className={cn(error && "border-red-500")}
				rows={rows}
				placeholder={placeHolder}
				onChange={(e) => setValue(e.target.value)}
				onBlur={(e) => {
					if (!submitValue) return;
					const valid = TextAreaFormElement.validate(element, e.target.value);
					setError(!valid);
					if (!valid) return;
					submitValue(element.id, e.target.value);
				}}
				value={value}
			/>
			{helperText &&
				<p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500")}>{helperText}</p>}
		</div>
	);
}

function PropertiesComponent({elementInstance}: { elementInstance: FormElementInstance }) {
	const element = elementInstance as TextAreaCustomInstance;
	const {updateElement} = useDesigner();
	const form = useForm<TextAreaPropertiesFormSchemaType>({
		resolver: zodResolver(TextAreaPropertiesSchema),
		mode: "onBlur",
		defaultValues: {
			label: element.extraAttributes.label,
			helperText: element.extraAttributes.helperText,
			required: element.extraAttributes.required,
			placeHolder: element.extraAttributes.placeHolder,
			rows: element.extraAttributes.rows,
		},
	});

	useEffect(() => {
		form.reset(element.extraAttributes);
	}, [element, form]);

	function applyChanges(values: TextAreaPropertiesFormSchemaType) {
		const {label, helperText, placeHolder, required, rows} = values;
		updateElement(element.id, {
			...element,
			extraAttributes: {
				label,
				helperText,
				placeHolder,
				required,
				rows,
			},
		});
	}

	return (
		<Form {...form}>
			<form
				onBlur={form.handleSubmit(applyChanges)}
				onSubmit={(e) => {
					e.preventDefault();
				}}
				className="space-y-3"
			>
				<FormField
					control={form.control}
					name="label"
					render={({field}) => (
						<FormItem>
							<FormLabel>Label</FormLabel>
							<FormControl>
								<Input
									{...field}
									onKeyDown={(e) => {
										if (e.key === "Enter") e.currentTarget.blur();
									}}
								/>
							</FormControl>
							<FormDescription>
								The label of the field. <br/> It will be displayed above the field
							</FormDescription>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="placeHolder"
					render={({field}) => (
						<FormItem>
							<FormLabel>PlaceHolder</FormLabel>
							<FormControl>
								<Input
									{...field}
									onKeyDown={(e) => {
										if (e.key === "Enter") e.currentTarget.blur();
									}}
								/>
							</FormControl>
							<FormDescription>The placeholder of the field.</FormDescription>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="helperText"
					render={({field}) => (
						<FormItem>
							<FormLabel>Helper text</FormLabel>
							<FormControl>
								<Input
									{...field}
									onKeyDown={(e) => {
										if (e.key === "Enter") e.currentTarget.blur();
									}}
								/>
							</FormControl>
							<FormDescription>
								The helper text of the field. <br/>
								It will be displayed below the field.
							</FormDescription>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="rows"
					render={({field}) => (
						<FormItem>
							<FormLabel>Rows {form.watch("rows")}</FormLabel>
							<FormControl>
								<Slider
									defaultValue={[field.value]}
									min={1}
									max={10}
									step={1}
									onValueChange={(value) => {
										field.onChange(value[0]);
									}}
								/>
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="required"
					render={({field}) => (
						<FormItem
							className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
							<div className="space-y-0.5">
								<FormLabel>Required</FormLabel>
								<FormDescription>
									The helper text of the field. <br/>
									It will be displayed below the field.
								</FormDescription>
							</div>
							<FormControl>
								<Switch checked={field.value} onCheckedChange={field.onChange}/>
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
