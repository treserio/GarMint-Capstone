/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { fetchByPath, validateField } from "./utils";
import { SimpleOne } from "../models";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { DataStore } from "aws-amplify";
export default function SimpleOneCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onCancel,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    postGres: undefined,
    SomethingElse: undefined,
  };
  const [postGres, setPostGres] = React.useState(initialValues.postGres);
  const [SomethingElse, setSomethingElse] = React.useState(
    initialValues.SomethingElse
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setPostGres(initialValues.postGres);
    setSomethingElse(initialValues.SomethingElse);
    setErrors({});
  };
  const validations = {
    postGres: [],
    SomethingElse: [],
  };
  const runValidationTasks = async (fieldName, value) => {
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          postGres,
          SomethingElse,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          await DataStore.save(new SimpleOne(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...rest}
      {...getOverrideProps(overrides, "SimpleOneCreateForm")}
    >
      <TextField
        label="Post gres"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              postGres: value,
              SomethingElse,
            };
            const result = onChange(modelFields);
            value = result?.postGres ?? value;
          }
          if (errors.postGres?.hasError) {
            runValidationTasks("postGres", value);
          }
          setPostGres(value);
        }}
        onBlur={() => runValidationTasks("postGres", postGres)}
        errorMessage={errors.postGres?.errorMessage}
        hasError={errors.postGres?.hasError}
        {...getOverrideProps(overrides, "postGres")}
      ></TextField>
      <TextField
        label="Something else"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              postGres,
              SomethingElse: value,
            };
            const result = onChange(modelFields);
            value = result?.SomethingElse ?? value;
          }
          if (errors.SomethingElse?.hasError) {
            runValidationTasks("SomethingElse", value);
          }
          setSomethingElse(value);
        }}
        onBlur={() => runValidationTasks("SomethingElse", SomethingElse)}
        errorMessage={errors.SomethingElse?.errorMessage}
        hasError={errors.SomethingElse?.hasError}
        {...getOverrideProps(overrides, "SomethingElse")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={resetStateValues}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Cancel"
            type="button"
            onClick={() => {
              onCancel && onCancel();
            }}
            {...getOverrideProps(overrides, "CancelButton")}
          ></Button>
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
