const validateUserInfo = ({ expertise, description, file }) => {
    // Presence Chack
    if (!expertise || expertise === "") {
        return {
            error: true,
            success: false,
            serverError: false,
            message: "Please Enter Your Expertise",
            form: {
                expertise: "Please Enter Your Expertise"
            },
            stage:1
        };
    }
    if (!description || description === "") {
        return {
            error: true,
            success: false,
            serverError: false,
            message: "Please Enter Description",
            form: {
                description: "Please Enter Your Description"
            },
            stage:1
        };
    }
    // Min Max Length Check
    if (expertise.length > 50) {
        return {
            error: true,
            success: false,
            serverError: false,
            message: "No More than 50 Characters Allowed",
            form: {
                expertise: "No More than 50 Characters Allowed"
            },
            stage:1
        };
    }
    if (expertise.trim().length < 3) {
        return {
            error: true,
            success: false,
            serverError: false,
            message: "Please Enter atleast 3 AlphaNumeric Characters",
            form: {
                expertise: "Please Enter atleast 3 AlphaNumeric Characters"
            },
            stage:1
        };
    }
    if (description.length > 200) {
        return {
            error: true,
            success: false,
            serverError: false,
            message: "No More than 200 Characters Allowed",
            form: {
                description: "No More than 200 Characters Allowed"
            },
            stage:1
        };
    }
    if (description.trim().length < 25) {
        return {
            error: true,
            success: false,
            serverError: false,
            message: "Please Enter atleast 25 AlphaNumeric Characters",
            form: {
                description: "Please Enter atleast 25 AlphaNumeric Characters"
            },
            stage:1
        };
    }
    if (file) {
        if (
            file.mimetype != "image/png" &&
            file.mimetype != "image/jpeg"
        ) {
            return {
                error: true,
                success: false,
                serverError: false,
                message: "File should be png or jpeg",
                form: {
                    file: "File should be png or jpeg"
                },
                stage:2
            };
        }
        if (file.size > 625000) {
            return {
                error: true,
                success: false,
                serverError: false,
                message: "File should not be more than 5MB",
                form: {
                    file: "File should not be more than 5MB"
                },
                stage:2
            };
        }
    }
    return {
        error: false,
        success: false,
        serverError: false,
        message: "Validation Completed",
        form: false
    };

}
export default validateUserInfo