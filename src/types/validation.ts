import * as Yup from "yup";

// Auth validation schemas
export const loginSchema = Yup.object().shape({
  email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu là bắt buộc"),
});

export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .required("Tên là bắt buộc"),
  email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu là bắt buộc"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
    .required("Xác nhận mật khẩu là bắt buộc"),
});

// Profile validation schema
export const profileSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .required("Tên là bắt buộc"),
  email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Số điện thoại không hợp lệ")
    .required("Số điện thoại là bắt buộc"),
});
