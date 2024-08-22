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

    export function OrderBy<T>(array: T[], propertyName: string, defaultValue?: any, desc: boolean = false): T[] {
        var modifier = !desc ? 1 : -1;
        return array.sort((a, b) => {
            var _a = a[propertyName as keyof T] ?? defaultValue
            var _b = b[propertyName as keyof T] ?? defaultValue

            if (_a === _b) {
                return 0
            }
            if (_a > _b) {
                return 1 * modifier
            }
            return -1 * modifier
        })
    }
}