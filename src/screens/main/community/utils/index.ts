import { ETopicVisibility } from "../../../../enums/topic";
import * as Yup from "yup";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
export const MAX_FILES_COUNT = 5;
export const MAX_TITLE_LENGTH = 100;

export interface CreateTopicFormValues {
  title: string;
  content: string;
  categoryIds: number[];
  visibility: ETopicVisibility;
  attachments: Array<{
    uri: string;
    name: string;
    type: string;
    size?: number;
  }>;
}

export const CreateTopicSchema = Yup.object().shape({
  title: Yup.string()
    .required("Tiêu đề là bắt buộc")
    .max(
      MAX_TITLE_LENGTH,
      `Tiêu đề không được vượt quá ${MAX_TITLE_LENGTH} ký tự`
    )
    .trim("Tiêu đề không được chứa khoảng trắng ở đầu và cuối"),

  content: Yup.string()
    .required("Nội dung là bắt buộc")
    .trim("Nội dung không được chứa khoảng trắng ở đầu và cuối"),

  categoryIds: Yup.array()
    .of(Yup.number().required("ID danh mục phải là số"))
    .required("Danh mục là bắt buộc")
    .min(1, "Vui lòng chọn ít nhất một danh mục"),

  visibility: Yup.string()
    .required("Chế độ hiển thị là bắt buộc")
    .oneOf(Object.values(ETopicVisibility), "Chế độ hiển thị không hợp lệ"),

  attachments: Yup.array()
    .of(
      Yup.object().shape({
        uri: Yup.string().required("Đường dẫn file là bắt buộc"),
        name: Yup.string().required("Tên file là bắt buộc"),
        type: Yup.string().required("Loại file là bắt buộc"),
        size: Yup.number()
          .optional()
          .test(
            "file-size",
            `Kích thước file không được vượt quá ${
              MAX_FILE_SIZE / 1024 / 1024
            }MB`,
            function (value) {
              // If size is not provided, skip validation
              if (value === undefined) return true;
              return value <= MAX_FILE_SIZE;
            }
          ),
      })
    )
    .default([])
    .max(MAX_FILES_COUNT, `Chỉ được đính kèm tối đa ${MAX_FILES_COUNT} tệp`)
    .test(
      "total-files-size",
      "Tổng kích thước các file quá lớn",
      function (files) {
        if (!files || files.length === 0) return true;

        const totalSize = files.reduce((sum, file) => {
          return sum + (file.size || 0);
        }, 0);

        // Allow total size up to 50MB (5 files * 10MB each)
        return totalSize <= MAX_FILE_SIZE * MAX_FILES_COUNT;
      }
    ),
});

export const validateSingleFile = (file: {
  uri: string;
  name: string;
  type: string;
  size?: number;
}): { isValid: boolean; error?: string } => {
  // Check file size
  if (file.size && file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File "${file.name}" vượt quá kích thước cho phép (${
        MAX_FILE_SIZE / 1024 / 1024
      }MB)`,
    };
  }

  // Check file name
  if (!file.name || file.name.trim().length === 0) {
    return {
      isValid: false,
      error: "Tên file không hợp lệ",
    };
  }

  // Check file type (basic validation)
  if (!file.type || file.type.trim().length === 0) {
    return {
      isValid: false,
      error: "Loại file không hợp lệ",
    };
  }

  return { isValid: true };
};

// Helper function to validate attachment list before adding new file
export const validateAttachmentList = (
  currentAttachments: Array<{
    uri: string;
    name: string;
    type: string;
    size?: number;
  }>,
  newFile?: { uri: string; name: string; type: string; size?: number }
): { isValid: boolean; error?: string } => {
  const totalFiles = newFile
    ? currentAttachments.length + 1
    : currentAttachments.length;

  // Check max files count
  if (totalFiles > MAX_FILES_COUNT) {
    return {
      isValid: false,
      error: `Chỉ được đính kèm tối đa ${MAX_FILES_COUNT} tệp`,
    };
  }

  // Check total size
  const currentTotalSize = currentAttachments.reduce((sum, file) => {
    return sum + (file.size || 0);
  }, 0);

  const newFileSize = newFile?.size || 0;
  const totalSize = currentTotalSize + newFileSize;

  if (totalSize > MAX_FILE_SIZE * MAX_FILES_COUNT) {
    return {
      isValid: false,
      error: "Tổng kích thước các file quá lớn",
    };
  }

  return { isValid: true };
};
