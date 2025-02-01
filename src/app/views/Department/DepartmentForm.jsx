import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useFormik} from "formik";
import * as Yup from "yup";
import {FormControlLabel, Radio, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TableCustom from "../../common/BuiHien/TableCustom";
import {observer} from "mobx-react";
import {useStore} from "../../stores";
import DatePickers from "../../common/BuiHien/DatePickers";

const useStyles = makeStyles((theme) => ({
    wapper: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: theme.spacing(2),
    },
    itemInput: {
        width: "45%",
    },
    wapperButton: {
        display: "flex",
        justifyContent: "center",
        gap: 10,
        marginTop: 10,
    },
    dialogTitle: {
        backgroundColor: "#01c0c8",

    }, dialogTitleText: {
        color: "#ffffff",  // Màu chữ trắng cho văn bản tiêu đề
        fontWeight: "bold",  // Cân chỉnh font chữ theo ý muốn
        fontSize: "18px",  // Kích thước font chữ
    },
    parent: {
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2),
        width: "100%",
        position: "relative", // Ensure the button is positioned relative to this container
    },
    parentTextField: {
        marginBottom: theme.spacing(2),
        width: "100%",
    },
    parentButton: {
        position: "absolute", // Position the button absolutely within the parent container
        top: -10,
        right: 0,
        backgroundColor: "#01c0c8",
        color: "#ffffff",
    }

}));

function DepartmentForm() {
    const [openDialog, setOpenDialog] = React.useState(false);

    const classes = useStyles();

    const {departmentStore} = useStore();
    const {
        departmentList,
        rowsPerPage,
        setRowsPerPage,
        totalPages,
        page,
        handleChangePage,
        selectedDepartment,
        shouldOpenEditorDialog,
        updateDepartment,
        saveDepartment,
        parent,
        setParent,
        setShouldOpenEditorDialog
    } = departmentStore;
    const formik = useFormik({
        initialValues: {
            id: selectedDepartment?.id || "",
            name: selectedDepartment?.name || "",
            code: selectedDepartment?.code || "",
            description: selectedDepartment?.description || "",
            func: selectedDepartment?.func || "",
            industryBlock: selectedDepartment?.industryBlock || "",
            foundedNumber: selectedDepartment?.foundedNumber || "",
            foundedDate: selectedDepartment?.foundedDate ? new Date(selectedDepartment.foundedDate).toISOString().split('T')[0] : "",
            displayOrder: selectedDepartment?.displayOrder || "",
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
                .min(5, "Ít nhất 5 ký tự")
                .max(500, "Nhiều nhất 500 ký tự")
                .required("Không được bỏ trống!"),
            func: Yup.string()
                .min(2, "Ít nhất 2 ký tự")
                .max(50, "Nhiều nhất 50 ký tự")
                .required("Không được bỏ trống!"),
            industryBlock: Yup.string()
                .min(2, "Ít nhất 2 ký tự")
                .max(100, "Nhiều nhất 100 ký tự")
                .required("Không được bỏ trống!"),
            foundedNumber: Yup.number()
                .positive("Số thành lập phải là số dương")
                .integer("Số thành lập phải là số nguyên")
                .required("Không được bỏ trống!"),
            displayOrder: Yup.number()
                .integer("Hiển thị thứ tự phải là số nguyên")
                .min(1, "Thứ tự hiển thị phải lớn hơn hoặc bằng 1")
                .required("Không được bỏ trống!"),
        }),
        onSubmit: async (values, {resetForm}) => {
            const valuesUpdate = {
                ...values,
                parent
            };
            try {
                if (selectedDepartment?.id) {
                    updateDepartment(valuesUpdate)
                } else {
                    saveDepartment(valuesUpdate)
                }
                resetForm();
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        },
    });
    const columns = [
        {
            title: 'Chọn',
            render: (rowData) => (
                <FormControlLabel
                    onClick={() => {
                        setParent(rowData);
                    }}
                    control={<Radio
                        checked={(parent?.id === rowData?.id) || (selectedDepartment?.parent?.id === rowData?.id)}/>}
                />
            ),
            sorting: false,
            filtering: false,
        },
        {
            title: 'Phòng ban trực thuộc',
            render: (rowData) => (rowData?.parent?.name ? rowData?.parent?.name : "Không có")

        },
        {title: 'name', field: 'name'},
        {title: 'code', field: 'code'},
        {title: 'description', field: 'description'},
        {title: 'func', field: 'func'},
        {title: 'industryBlock', field: 'industryBlock'},
        {title: 'foundedNumber', field: 'foundedNumber'},
        {title: 'foundedDate', field: 'foundedDate'},
        {title: 'displayOrder', field: 'displayOrder'},
    ];
    useEffect(() => {
        formik.resetForm();
    }, [openDialog])
    return (
        <>
            <Dialog
                open={shouldOpenEditorDialog}
                onClose={() => setShouldOpenEditorDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" className={classes.dialogTitle}>
                <span className={classes.dialogTitleText}>
                    {selectedDepartment?.id ? "Edit Department" : "Create Department"}
                </span>
                </DialogTitle>
                <DialogContent>
                    <div className={classes.parent}>
                        <TextField
                            className={classes.parentTextField}
                            label="Đơn vị trực thuộc"
                            variant="outlined"
                            color="secondary"
                            value={selectedDepartment?.parent?.name ? selectedDepartment.name : (parent?.name || "")}
                            onClick={() => setOpenDialog(true)}
                        />
                        <Button
                            className={classes.parentButton}
                            variant="contained"
                            disableElevation
                            onClick={() => setOpenDialog(true)}
                        >Lựa chọn
                        </Button>
                    </div>
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
                            {/* Thêm các trường mới */}
                            <TextField
                                className={classes.itemInput}
                                label="Function"
                                variant="outlined"
                                color="secondary"
                                name="func"
                                value={formik.values.func}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.func && Boolean(formik.errors.func)}
                                helperText={formik.touched.func && formik.errors.func}
                            />
                            <TextField
                                className={classes.itemInput}
                                label="Industry Block"
                                variant="outlined"
                                color="secondary"
                                name="industryBlock"
                                value={formik.values.industryBlock}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.industryBlock && Boolean(formik.errors.industryBlock)}
                                helperText={formik.touched.industryBlock && formik.errors.industryBlock}
                            />
                            <TextField
                                className={classes.itemInput}
                                label="Founded Number"
                                variant="outlined"
                                color="secondary"
                                name="foundedNumber"
                                type="number"
                                value={formik.values.foundedNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.foundedNumber && Boolean(formik.errors.foundedNumber)}
                                helperText={formik.touched.foundedNumber && formik.errors.foundedNumber}
                            />
                            <DatePickers
                                labelDate="Founded Date"
                                value={formik.values.foundedDate ? formik.values.foundedDate : new Date()}
                                onChange={(date) => formik.setFieldValue('foundedDate', date)}
                                isTime={false}
                                className={classes.itemInput}
                            />
                            <TextField
                                className={classes.itemInput}
                                label="Display Order"
                                variant="outlined"
                                color="secondary"
                                name="displayOrder"
                                type="number"
                                value={formik.values.displayOrder}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.displayOrder && Boolean(formik.errors.displayOrder)}
                                helperText={formik.touched.displayOrder && formik.errors.displayOrder}
                            />
                        </div>
                        <div className={classes.wapperButton}>
                            <Button variant="contained" color="inherit"
                                    onClick={() => setShouldOpenEditorDialog(false)}>
                                Hủy
                            </Button>
                            <Button type="submit" variant="contained" color="inherit">
                                {selectedDepartment?.id ? "Update" : "Save"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            {openDialog && (
                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent>
                        <TableCustom
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={setRowsPerPage}
                            totalPages={totalPages}
                            page={page}
                            handleChangePage={handleChangePage}
                            title={"Lựa chọn phòng ban"}
                            datas={departmentList}
                            columns={columns}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenDialog(false)
                            setParent(null)
                        }}
                                color="primary">
                            Đóng
                        </Button>
                        <Button onClick={() => setOpenDialog(false)} color="primary">
                            Lưu
                        </Button>
                    </DialogActions>
                </Dialog>)}
        </>
    );
}

export default (observer(DepartmentForm));