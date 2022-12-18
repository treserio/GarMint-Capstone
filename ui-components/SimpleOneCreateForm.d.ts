/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type SimpleOneCreateFormInputValues = {
    postGres?: string;
    SomethingElse?: string;
};
export declare type SimpleOneCreateFormValidationValues = {
    postGres?: ValidationFunction<string>;
    SomethingElse?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SimpleOneCreateFormOverridesProps = {
    SimpleOneCreateFormGrid?: FormProps<GridProps>;
    postGres?: FormProps<TextFieldProps>;
    SomethingElse?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type SimpleOneCreateFormProps = React.PropsWithChildren<{
    overrides?: SimpleOneCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: SimpleOneCreateFormInputValues) => SimpleOneCreateFormInputValues;
    onSuccess?: (fields: SimpleOneCreateFormInputValues) => void;
    onError?: (fields: SimpleOneCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: SimpleOneCreateFormInputValues) => SimpleOneCreateFormInputValues;
    onValidate?: SimpleOneCreateFormValidationValues;
} & React.CSSProperties>;
export default function SimpleOneCreateForm(props: SimpleOneCreateFormProps): React.ReactElement;
