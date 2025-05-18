import React from "react";
import { Formik, FormikProps, FormikHelpers } from "formik";
import { View, StyleSheet } from "react-native";
import * as Yup from "yup";

interface FormProps<T extends Yup.AnyObject> {
  initialValues: T;
  validationSchema: Yup.ObjectSchema<T>;
  onSubmit: (values: T, helpers: FormikHelpers<T>) => void | Promise<void>;
  children: (props: FormikProps<T>) => React.ReactNode;
}

export function Form<T extends Yup.AnyObject>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
}: FormProps<T>) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formikProps) => (
        <View style={styles.container}>{children(formikProps)}</View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
