import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useFormik} from "formik";
import * as Yup from "yup";
import {TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
    wapper: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    itemInput: {
        width: "100%",
    },
    wapperButton: {
        display: "flex",
        justifyContent: "center",
        gap: 10,
        marginTop: 10,
    },
}));

export default function CountryForm({data, isOpen, setClose, updateCountry, createCountry}) {
    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            id: data?.id || "",
            name: data?.name || "",
            code: data?.code || "",
            description: data?.description || "",
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string()
                .min(2, "Ít nhất 2 ký tự")
                .max(15, "Nhiều nhất 15 ký tự")
                .required("Không được bỏ trống!"),
            code: Yup.string()
                .min(2, "Ít nhất 2 ký tự")
                .max(15, "Nhiều nhất 15 ký tự")
                .required("Không được bỏ trống!"),
            description: Yup.string()
                .min(10, "Ít nhất 10 ký tự")
                .max(500, "Nhiều nhất 500 ký tự")
                .required("Không được bỏ trống!"),
        }),
        onSubmit: async (values, {resetForm}) => {
            try {
                if (data?.id) {
                    updateCountry(values)
                } else {
                    createCountry(values)
                }
                resetForm();
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        },
    });
    return (
        <Dialog
            open={isOpen}
            onClose={() => setClose(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {data?.id ? "Edit Country" : "Create Country"}
            </DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <div className={classes.wapper}>
                        <TextField
                            className={classes.itemInput}
                            label="Name"
                            variant="outlined"
                            color="secondary"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            className={classes.itemInput}
                            label="Code"
                            variant="outlined"
                            color="secondary"
                            name="code"
                            value={formik.values.code}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.code && Boolean(formik.errors.code)}
                            helperText={formik.touched.code && formik.errors.code}
                        />
                        <TextField
                            className={classes.itemInput}
                            label="Description"
                            variant="outlined"
                            color="secondary"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                    </div>
                    <div className={classes.wapperButton}>
                        <Button variant="contained" color="inherit" onClick={() => setClose(false)}>
                            Hủy
                        </Button>
                        <Button type="submit" variant="contained" color="inherit">
                            {data?.id ? "Update" : "Save"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
