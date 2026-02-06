import { object, string, number, mixed } from "yup";
import lan from "../../locales/en.json";


export const updateClientPlanValidate = object({
params: object({
    id: number().positive().required("smeId field is require"),
}),
body: object({
    packId: number().positive().required("packId field is require"),
}),
});

export const addLongcodePlanValidate = object({
    body: object({
        longCode: string().required("longCode field is require"),
        operatorName: string().required("operatorName field is require"),
        numberType: string().required("numberType field is require"),
        siteId: string().required("siteId field is require"),
        dataCenter: string().required("dataCenter field is require"),
        type: string().required("type field is require"),
    }),
});

export const updateSmeSMSBalanceValidate = object({
    params: object({
        id: number().positive().required("smeId field is require"),
    }),
    body: object({
        smsbalanceAdd: number().positive().required("smsbalanceAdd field is require"),
    }),
});



