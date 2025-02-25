import {makeAutoObservable, runInAction} from "mobx";
import {
    pagingDepartments,
    pagingAllDepartments,
    getDepartment,
    createDepartment,
    editDepartment,
    deleteDepartment,
    checkCode,
    getListDepartment,
    getTreeView
} from "../Department/DepartmentService";
import {toast} from "react-toastify";

export default class DepartmentStore {
    departmentList = [];
    selectedDepartment = null;
    selectedList = [];
    parentId = "";
    parent = null;
    totalElements = 0;
    totalPages = 0;
    page = 1;
    rowsPerPage = 10;
    keyword = "";
    loadingInitial = false;
    shouldOpenEditorDialog = false;
    shouldOpenConfirmationDialog = false;
    shouldOpenSelectDepartmentDialog = false;

    constructor() {
        makeAutoObservable(this);
    }


    setLoadingInitial = (state) => {
        this.loadingInitial = state;
    };
    setParent = (state) => {
        this.parent = state;
    };
    setSelectedList = (state) => {
        this.selectedList = state;
    }
    setShouldOpenSelectDepartmentDialog = (state) => {
        this.shouldOpenSelectDepartmentDialog = state;
    };
    setSelectedDepartment = (value) => {
        this.selectedDepartment = value;
    };
    setKeyword = (value) => {
        this.keyword = value;  // Cập nhật 'keyword' trong store
    }

    search = async () => {
        this.loadingInitial = true;

        const searchObject = {
            keyword: this.keyword,
            pageIndex: this.page,
            pageSize: this.rowsPerPage,
        };

        function flattenDepartments(departments) {
            let result = [];

            function recurse(deptList) {
                deptList.forEach(dept => {
                    result.push(dept);
                    if (dept.children && dept.children.length > 0) {
                        recurse(dept.children);
                    }
                });
            }

            recurse(departments);
            return result;
        }

        try {
            let res = await pagingDepartments(searchObject);

            runInAction(() => {
                if (res?.data?.content) {
                    this.departmentList = flattenDepartments(res.data.content);
                } else {
                    this.departmentList = [];
                }
                this.totalElements = res?.data?.totalElements;
                this.totalPages = res?.data?.totalPages;
                this.loadingInitial = false;
            });
        } catch (error) {
            toast.warning("Failed to load departments.");
            this.loadingInitial = false;
        }
    };

    setShouldOpenConfirmationDialog = (state) => {
        this.shouldOpenConfirmationDialog = state;
    }

    setShouldOpenEditorDialog = (state) => {
        this.shouldOpenEditorDialog = state;
    }

    handleClose() {
        this.shouldOpenEditorDialog = false;
    }

    updatePageData = (keyword) => {
        if (keyword !== "" && keyword !== undefined && keyword !== null) {
            this.page = 1;
            this.keyword = keyword;
        }
        this.search();
    };
    setPage = (page) => {
        this.page = page;
        this.updatePageData();
    };

    setRowsPerPage = (event) => {
        this.rowsPerPage = Number(event.target.value) || 10;
        this.page = 1;
        this.updatePageData();
    };
    setPageSize = (values) => {
        this.rowsPerPage = Number(values);
        this.page = 1;
        this.updatePageData();
    }
    handleChangePage = (event, newPage) => {
        this.setPage(newPage);
    };

    handleClose = (state) => {
        this.shouldOpenEditorDialog = false;
        this.shouldOpenConfirmationDialog = false;
        if (state) this.search();
    };

    handleConfirmDelete = async () => {
        try {
            console.log("hien", this.selectedDepartment.id);
            const res = await deleteDepartment(this.selectedDepartment.id);
            if (res?.data) {
                this.handleClose(true);
                toast.success("Deleted successfully.");
            } else {
                console.error(res?.data);
                toast.warning("Deleted failure.");
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred. Please try again later.");
        }
    };

    getDepartment = async (id) => {
        if (id != null) {
            try {
                const data = await getDepartment(id);
                this.handleSelectDepartment(data?.data);
            } catch (error) {
                console.log(error);
            }
        } else {
            this.handleSelectDepartment(null);
        }
    };

    handleSelectDepartment = (department) => {
        this.selectedDepartment = department;
    };

    updateDepartment = async (department) => {
        try {
            console.log(this)
            const res = await editDepartment(department);
            this.handleClose(true);
            toast.success("Updated successfully!")
            return res?.data;
        } catch (error) {
            console.log(error);
            toast.warning("An error occurred while updating.");
        }
    };

    saveDepartment = async (department) => {
        try {
            const res = await createDepartment(department);
            this.handleClose(true);
            toast.success("Created successfully!"
            );
            return res?.data;
        } catch (error) {
            console.log(error);
            toast.warning("An error occurred while saving.");
        }
    };

    resetDepartmentStore = () => {
        this.DepartmentList = [];
        this.totalElements = 0;
        this.totalPages = 0;
        this.selectedDepartment = null;
        this.page = 1;
        this.rowsPerPage = 10;
        this.keyword = "";
        this.loadingInitial = false;
        this.shouldOpenEditorDialog = false;
        this.shouldOpenConfirmationDialog = false;
    };
}
