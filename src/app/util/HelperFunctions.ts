export module HelperFunctions {
    export function isEmptyOrSpaces(str: any): boolean {
        return str === null || str === undefined || (str + '').match(/^ *$/) !== null;
    }

    export function ParseObjectAsQueryString<T>(params: T): string {
        if (!params) {
            return '';
        }

        let queryParams = '';
        let index = 0;

        Object.keys(params).forEach((key: string) => {
            const paramsField = params[key as keyof T]
            if (paramsField != undefined && paramsField != null && !HelperFunctions.isEmptyOrSpaces(paramsField)) {
                if (Array.isArray(paramsField) && paramsField.length > 0) {
                    for (let i = 0; i < paramsField.length; i++) {
                        if (index == 0) {
                            queryParams += key + '=' + paramsField[i];
                        } else {
                            queryParams += '&' + key + '=' + paramsField[i];
                        }
                        index++;
                    }
                } else {
                    if (index == 0) {
                        queryParams += key + '=' + paramsField;
                    } else {
                        queryParams += '&' + key + '=' + paramsField;
                    }
                    index++;
                }
            }
        });

        return queryParams;
    }
}