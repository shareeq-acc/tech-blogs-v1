import { isAlphaNumeric, onlyLetters } from "./stringValidation.js";

// This Function Manually Validates Blog Fields
export const validateBlog = (blog) => {
  if (
    !blog.title ||
    !blog.description ||
    !blog.tags ||
    !blog.category ||
    (!blog.file && blog.noFile == false)
  ) {
    return {
      error: true,
      success: false,
      serverError: false,
      form: {
        main: "Please Fill All the Fields"
      },
      message: "Please Fill All the Fields",
    };
  }
  //   Title Validation
  if (blog.title.length > 50) {
    return {
      error: true,
      success: false,
      serverError: false,
      message: "Title Should not exceed 50 Characters",
      form: {
        title: "Title Should not exceed 50 Characters"
      }
    };
  }
  if (blog.title.length < 5) {
    return {
      error: true,
      success: false,
      serverError: false,
      message: "Title Should be atleast 5 Characters",
      form: {
        title: "Title Should be atleast 5 Characters"
      }
    };
  }
  //   Validate Description
  if (blog.description.length > 140) {
    return {
      error: true,
      success: false,
      serverError: false,
      message: "Description Should not exceed 140 Characters",
      form: {
        description: "Description Should not exceed 140 Characters"
      }
    };
  }
  if (blog.description.length < 20) {
    return {
      error: true,
      success: false,
      serverError: false,
      message: "Description Should be atleast 20 Characters",
      form: {
        description: "Description Should be atleast 20 Characters"
      }

    };
  }
  // Validate Content
  if (blog.content.length > 5000) {
    return {
      error: true,
      success: false,
      serverError: false,
      message: "Blog Content Should not exceed 5000 Characters",
      form: {
        content: "Blog Content Should not exceed 5000 Characters"
      }
    };
  }
  if (blog.content.length < 30) {
    return {
      error: true,
      success: false,
      serverError: false,
      message: "Blog Content Should be atleast 30 Characters",
      form: {
        content: "Blog Content Should be atleast 30 Characters"
      }
    };
  }
  // Validate Tags
  let tagError = false;
  let i = 0;
  while (i < blog.tags.split(",").length && tagError == false) {
    const tag = blog.tags.split(",")[i];
    if (tag.trim().includes(" ") == true) {
      tagError = true;
      return {
        error: true,
        success: false,
        serverError: false,
        message: "Tags Should Not contain Spaces",
        form: {
          tags: "Tags Should Not contain Spaces"
        }
      };
    }
    if (isAlphaNumeric(tag.trim()) == false) {
      tagError = true;
      return {
        error: true,
        success: false,
        serverError: false,
        message: "Tags Should Only contain Letters and Numbers",
        form: {
          tags: "Tags Should Only contain Letters and Numbers"
        }
      };
    }
    if (tag.length > 10) {
      tagError = true;
      return {
        error: true,
        success: false,
        serverError: false,
        message: "Tag Should not exceed 10 Characters",
        form: {
          tags: "Tag Should not exceed 10 Characters"
        }
      };
    }
    if (tag.length < 3) {
      tagError = true;
      return {
        error: true,
        success: false,
        serverError: false,
        message: "Tag Should be atleast 3 Characters",
        form: {
          tags: "Tag Should be atleast 3 Characters"
        }
      };
    }
    i++;
  }
  // Validate OtherCategory
  if (blog.otherCategory == "" && blog.category == "other") {
    return {
      error: true,
      success: false,
      serverError: false,
      message: "Please Enter Blog Category",
      form: {
        otherCategory: "Please Enter Blog Category",
      }
    };
  }
  if (blog.otherCategory.length > 10 && blog.category == "other") {
    return {
      error: true,
      success: false,
      serverError: false,
      message: "Category should not exceed 10 Characters",
      form: {
        otherCategory: "Category should not exceed 10 Characters",
      }
    };
  }
  if (blog.otherCategory.length < 2 && blog.category == "other") {
    return {
      error: true,
      success: false,
      serverError: false,
      message: "Category Should be atleast 2 Characters",
      form: {
        otherCategory: "Category Should be atleast 2 Characters"
      }
    };
  }
  if (
    blog.category == "other" &&
    onlyLetters(blog.otherCategory.trim()) == false
  ) {
    return {
      error: true,
      success: false,
      serverError: false,
      message: "Category Should contain only Alphabets with no Spaces",
      form: {
        otherCategory: "Category Should contain only Alphabets with no Spaces"
      }

    };
  }
  // Validate File;
  // Only Validate if File is Present e.g Creating a New Blog File Must be there hence noFile Parameter must be set to False
  // While Updating if file is Updated the, nofile must be Set to False, if File is not Updated then No File Must be Set to True

  if (!blog.noFile) {
    if (
      blog.file.mimetype != "image/png" &&
      blog.file.mimetype != "image/jpeg"
    ) {
      return {
        error: true,
        success: false,
        serverError: false,
        message: "File should be png or jpeg",
        form: {
          file: "File should be png or jpeg"
        }
      };
    }
    if (blog.file.size > 625000) {
      return {
        error: true,
        success: false,
        serverError: false,
        message: "File should not be more than 5MB",
        form: {
          file: "File should not be more than 5MB"
        }
      };
    }
  }
  return {
    error: false,
    success: true,
    serverError: false,
    message: "Blog Data is Valid",
    form: {}
  };
};
