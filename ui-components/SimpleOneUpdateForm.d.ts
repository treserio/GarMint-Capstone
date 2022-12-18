/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { SimpleOne } from "../models";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type SimpleOneUpdateFormInputValues = {
    postGres?: string;
    SomethingElse?: string;
};
export declare type SimpleOneUpdateFormValidationValues = {
    postGres?: ValidationFunction<string>;
    SomethingElse?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SimpleOneUpdateFormOverridesProps = {
    SimpleOneUpdateFormGrid?: FormProps<GridProps>;
    postGres?: FormProps<TextFieldProps>;
    SomethingElse?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type SimpleOneUpdateFormProps = React.PropsWithChildren<{
    overrides?: SimpleOneUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    simpleOne?: SimpleOne;
    onSubmit?: (fields: SimpleOneUpdateFormInputValues) => SimpleOneUpdateFormInputValues;
    onSuccess?: (fields: SimpleOneUpdateFormInputValues) => void;
    onError?: (fields: SimpleOneUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: SimpleOneUpdateFormInputValues) => SimpleOneUpdateFormInputValues;
    onValidate?: SimpleOneUpdateFormValidationValues;
} & React.CSSProperties>;
export default function SimpleOneUpdateForm(props: SimpleOneUpdateFormProps): React.ReactElement;
