import { TextField } from "@mui/material";

const FormTextField = ({ sx, ...props }) => {
    return (
        <TextField
            variant="standard"
            fullWidth
            {...props}
            sx={{
                "& .MuiInputBase-input": {
                    color: "white",
                    fontSize: 20,
                },

                "& .MuiInputLabel-root": {
                    color: "#F2F9FF",
                    fontSize: 15,
                },

                "& .MuiInput-underline:before": {
                    borderBottomColor: "white",
                },

                "& .MuiInput-underline:after": {
                    borderBottomColor: "white",
                },

                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                    borderBottomColor: "white",
                },

                ...sx,
            }}
        />
    );
};

export default FormTextField;
