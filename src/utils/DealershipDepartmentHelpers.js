import axios from 'axios';
import config from 'config';
import deepcopy from 'deepcopy';
import ErrorParser from "./ErrorParser";

class DealershipDepartmentsHelpers
{


    static departmentsAsync( dealershipId, method, dealershipDepartmentsContainer, reduceNumberOfApiCallsCallBack, getValidationParameters )
    {
        //for the insert method get the departments that were checked and insert them as dealershipDepartments and also
        //insert the departmentTasks for each of them.
        if ( method === 'post' ) {
            let newDepartments = DealershipDepartmentsHelpers.getInsertNewDepartments(dealershipDepartmentsContainer);
            newDepartments.forEach(element => {
                DealershipDepartmentsHelpers.addDealershipDepartment(dealershipId, element.department.id,
                    element.defaultTasks.newElements, reduceNumberOfApiCallsCallBack, getValidationParameters);
            });
        }

        //for the update method first insert the new dealershipDepartments and the departmentTasks associated,
        //second, delete the dealershipDepartments that were unChecked, and the departmentTasks associated.
        //third for the dealershipDepartments that remained checked update the department task by deleting or inserting new
        //department tasks.
        if ( method === 'put' ) {

            //new dealershipDepartments needs to be added, with default task
            let newElements = DealershipDepartmentsHelpers.getDealershipDepartmentsToBeInserted(dealershipDepartmentsContainer);

            //dealershipDepartments that are unChecked needs to be deleted from db.
            let elementsToBeDeleted = DealershipDepartmentsHelpers.getDealershipDepartmentsToBeDeleted(dealershipDepartmentsContainer);
            newElements.forEach(element => {
                DealershipDepartmentsHelpers.addDealershipDepartment(dealershipId, element.department.id,
                    element.defaultTasks.newElements, reduceNumberOfApiCallsCallBack, getValidationParameters);
            });
            elementsToBeDeleted.forEach(element => {
                DealershipDepartmentsHelpers.deleteDealershipDepartment(element.id, reduceNumberOfApiCallsCallBack, getValidationParameters);
            })


            //for the dealershipDepartments that remained checked verify if the default tasks changed. If they did, update the db.
            let dealershipDepartmentsStillChecked = DealershipDepartmentsHelpers.getDealershipDepartmentsStillChecked(dealershipDepartmentsContainer);
            dealershipDepartmentsStillChecked.forEach(element => {

                //add new default tasks
                DealershipDepartmentsHelpers.addDealershipTasks(element.dealershipDepartmentId,
                    element.labelListElements.newElements, reduceNumberOfApiCallsCallBack, getValidationParameters);
                DealershipDepartmentsHelpers.deleteDealershipTasks(element.dealershipDepartmentId,
                    element.labelListElements.oldElements, reduceNumberOfApiCallsCallBack, getValidationParameters);
            });
        }
    }

    static getInsertNewDepartments( dealershipDepartmentsContainer )
    {
        let list = [];
        dealershipDepartmentsContainer.listElements.forEach(element => {
            if ( element.checked ) {
                list.push(element);
            }
        });
        return list;
    }

    static countNumberOfDealershipTasks( elementsList )
    {
        let nrDealershipTasks = 0;
        elementsList.forEach(element => {
            nrDealershipTasks += element.defaultTasks.newElements.length
        });
        return nrDealershipTasks;
    }

    static addDealershipDepartment( dealershipId, departmentId, newElements, reduceNumberOfApiCallsCallBack, getValidationParameters )
    {
        //let data;

        axios({
            method: 'put',
            url: config.api + '/Dealerships/' + dealershipId + '/departments/rel/' + departmentId
        })
            .then(response => {
                if ( response.status === 200 ) {
                    reduceNumberOfApiCallsCallBack();
                    let dealershipDepartment = response.data;
                    DealershipDepartmentsHelpers.addDealershipTasks(dealershipDepartment.id, newElements,
                        reduceNumberOfApiCallsCallBack, getValidationParameters);
                }
            })
            .catch(error => {
                if ( error.response ) {
                    let validationParameters = getValidationParameters();

                    ErrorParser.parseError(error.response.data, validationParameters.history,
                        validationParameters.onAddCriticalError, validationParameters.onAddValidationError);
                }
            });
    }

    static deleteDealershipDepartment( dealershipDepartmentId, reduceNumberOfApiCallsCallBack, getValidationParameters)
    {
        axios({
            method: 'delete',
            url: config.api + '/DealershipDepartments/' + dealershipDepartmentId
        })
            .then(response => {
                if ( response.status === 200 ) {
                    reduceNumberOfApiCallsCallBack();
                }
            })
            .catch(error => {
                if ( error.response ) {
                    let validationParameters = getValidationParameters();
                    ErrorParser.parseError(error.response.data, validationParameters.history,
                        validationParameters.onAddCriticalError, validationParameters.onAddValidationError);
                }
            });
    }

    static getDealershipDepartmentsToBeInserted( dealershipDepartmentsContainer )
    {
        let elementsToBeInserted = [];
        dealershipDepartmentsContainer.listElements.forEach(element => {
            if ( element.checked ) {
                let alreadyInserted = false;
                dealershipDepartmentsContainer.dealershipDepartments.forEach(dealershipDepartmentElement => {
                    if ( dealershipDepartmentElement.departmentId === element.department.id ) {
                        alreadyInserted = true;
                    }
                });
                if ( alreadyInserted === false ) {
                    elementsToBeInserted.push(deepcopy(element));
                }
            }
        });

        return elementsToBeInserted;
    }

    static getDealershipDepartmentsToBeDeleted( dealershipDepartmentsContainer )
    {
        let elementsToBeDeleted = [];
        dealershipDepartmentsContainer.listElements.forEach(element => {
            if ( !element.checked ) {
                let dealershipDepartmentExists = false;
                let dealershipDepartmentToBeDeleted = null;
                dealershipDepartmentsContainer.dealershipDepartments.forEach(dealershipDepartmentElement => {
                    if ( dealershipDepartmentElement.departmentId === element.department.id ) {
                        dealershipDepartmentExists = true;
                        dealershipDepartmentToBeDeleted = dealershipDepartmentElement;
                    }
                });
                if ( dealershipDepartmentExists === true ) {
                    elementsToBeDeleted.push(dealershipDepartmentToBeDeleted);
                }
            }
        });

        return elementsToBeDeleted;
    }

    static getDealershipDepartmentsStillChecked( dealershipDepartmentsContainer )
    {
        let result = [];
        dealershipDepartmentsContainer.listElements.forEach(element => {
            if ( element.checked ) {
                let dealershipDepartmentExists = false;
                let informationForDepartmentTask = null;
                dealershipDepartmentsContainer.dealershipDepartments.forEach(dealershipDepartmentElement => {
                    if ( dealershipDepartmentElement.departmentId === element.department.id ) {
                        dealershipDepartmentExists = true;
                        informationForDepartmentTask = {
                            dealershipDepartmentId: dealershipDepartmentElement.id,
                            labelListElements: element.defaultTasks
                        };
                    }
                });
                if ( dealershipDepartmentExists === true ) {
                    result.push(informationForDepartmentTask);
                }
            }
        });

        return result;
    }

    static getDataForAddDealershipTasks( newElements )
    {
        let newElementsCopy = deepcopy(newElements);

        //select only the name from the newElements copy
        let data = newElementsCopy.map(element => (
            {
                name: element.name
            }
        ));
        return data;
    }

    //newElements is an array of objects that came from labelists component
    static addDealershipTasks( dealershipDepartmentId, newElements, reduceNumberOfApiCallsCallBack, getValidationParameters )
    {
        let data = this.getDataForAddDealershipTasks(newElements);
        //insert them in the db using the api
        // data.forEach(elementData, index => {
        this.addDealershipTasksApiCall(dealershipDepartmentId, data, 0, reduceNumberOfApiCallsCallBack, getValidationParameters);
        // })

    }


    static addDealershipTasksApiCall( dealershipDepartmentId, data, index, reduceNumberOfApiCallsCallBack, getValidationParameters )
    {
        if ( index === data.length ) {
            return;
        }
        axios({
            method: 'post',
            url: config.api + '/DealershipDepartments/' + dealershipDepartmentId + '/departmentTasks',
            data: data[index]
        })
            .then(response => {
                if ( response.status === 200 ) {
                    reduceNumberOfApiCallsCallBack();
                    this.addDealershipTasksApiCall(dealershipDepartmentId, data, index + 1, reduceNumberOfApiCallsCallBack);
                }
            })
            .catch(error => {
                if ( error.response ) {
                    let validationParameters = getValidationParameters();
                    ErrorParser.parseError(error.response.data, validationParameters.history,
                        validationParameters.onAddCriticalError, validationParameters.onAddValidationError);
                }
            });
    }

    static getDataForDeleteDealershipTasks( oldElements )
    {
        let oldElementsCopy = deepcopy(oldElements);

        //select only the name from the newElements copy
        let data = [];
        oldElementsCopy.forEach(element => {
            if ( element.pendingDelete ) {
                data.push(element.id);
            }
        });
        return data;
    }

    static deleteDealershipTasks( dealershipDepartmentId, oldElements, reduceNumberOfApiCallsCallBack, getValidationParameters )
    {
        let data = this.getDataForDeleteDealershipTasks(oldElements);
        //insert them in the db using the api
        this.deleteDealershipTaskApi(dealershipDepartmentId, data, 0, reduceNumberOfApiCallsCallBack, getValidationParameters);

    }

    static deleteDealershipTaskApi( dealershipDepartmentId, data, index, reduceNumberOfApiCallsCallBack, getValidationParameters )
    {
        if ( index === data.length ) {
            return;
        }

        axios({
            method: 'delete',
            url: config.api + '/DealershipDepartments/' + dealershipDepartmentId + '/departmentTasks/' + data[index]
        })
            .then(response => {
                if ( response.status === 204 ) {
                    reduceNumberOfApiCallsCallBack();
                    DealershipDepartmentsHelpers.deleteDealershipTaskApi(dealershipDepartmentId, data, index + 1, reduceNumberOfApiCallsCallBack);
                }
            })
            .catch(error => {
                if ( error.response ) {
                    let validationParameters = getValidationParameters();
                    ErrorParser.parseError(error.response.data, validationParameters.history,
                        validationParameters.onAddCriticalError, validationParameters.onAddValidationError);
                }
            });
    }

    static objectIsmepty( objectToCheck )
    {
        return Object.keys(objectToCheck).length === 0 && objectToCheck.constructor === Object
    }

    ///COUNT TASKS
    static countNumberOfAsyncCalls( method, dealershipDepartmentsContainer )
    {

        let dealershipDepartmentsInsertCalls = 0;
        let dealershipDepartmentsTasksInsertCalls = 0;
        let dealershipDepartmentsToBeDeletedCalls = 0;
        let dealershipDepartmentsTasksToBeDeletedCalls = 0;
        if ( !DealershipDepartmentsHelpers.objectIsmepty(dealershipDepartmentsContainer) ) {
            if ( method === 'post' ) {
                let newDepartments = DealershipDepartmentsHelpers.getInsertNewDepartments(dealershipDepartmentsContainer);
                dealershipDepartmentsInsertCalls = newDepartments.length;
                dealershipDepartmentsTasksInsertCalls = DealershipDepartmentsHelpers.countNumberOfDealershipTasks(newDepartments);

                //in case of put
            } else {

                //case of insert of dealershipDepartments
                let newDepartments = DealershipDepartmentsHelpers.getDealershipDepartmentsToBeInserted(dealershipDepartmentsContainer);
                dealershipDepartmentsInsertCalls = newDepartments.length;
                dealershipDepartmentsTasksInsertCalls = DealershipDepartmentsHelpers.countNumberOfDealershipTasks(newDepartments);
                //case of delete of dealershipDepartments
                dealershipDepartmentsToBeDeletedCalls = DealershipDepartmentsHelpers.getDealershipDepartmentsToBeDeleted(dealershipDepartmentsContainer).length;

                //case of dealershipDepartment is still checked and there are modification to the dealershipTask
                let dealershipDepartmentsStillChecked = DealershipDepartmentsHelpers.getDealershipDepartmentsStillChecked(dealershipDepartmentsContainer);
                dealershipDepartmentsStillChecked.forEach(element => {
                    dealershipDepartmentsTasksInsertCalls += DealershipDepartmentsHelpers.getDataForAddDealershipTasks(element.labelListElements.newElements).length;
                    //add new default tasks
                    dealershipDepartmentsTasksToBeDeletedCalls += DealershipDepartmentsHelpers.getDataForDeleteDealershipTasks(element.labelListElements.oldElements).length;
                });

            }
        }
        let totalApiCalls = dealershipDepartmentsInsertCalls + dealershipDepartmentsTasksInsertCalls +
            dealershipDepartmentsToBeDeletedCalls + dealershipDepartmentsTasksToBeDeletedCalls;
        return totalApiCalls;
    }
}

export default DealershipDepartmentsHelpers;
