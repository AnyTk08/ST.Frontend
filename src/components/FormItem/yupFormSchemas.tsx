import * as yup from "yup";
import i18n from 'config/i18nConfig';
import moment from "moment";
import { IsNullOrUndefined } from "utilities/ST_Function";

const yupFormSchemas = {
    generic(label: any) {
        return yup.mixed().label(label);
    },
    object(label: any, config?: any) {
        config = config || {};

        let yupChain = yup
            .object()
            .label(label)
            // .default(null)
            .nullable()
        if (config.required) {
            config.msg = i18n.t("msgPleaseSpecify") + " " + label ;
            yupChain = yupChain.required(config.msg);
        }
        return yupChain;
    },
    string(label: any, config?: any) {
        config = config || {};
        let yupChain = yup
            .string()
            .transform((cv, ov) => {
                return ov === "" ? null : cv;
            })
            .nullable()
            .trim()
            .label(label);

        if (config.required) {
            config.msg = i18n.t("msgPleaseSpecify") + " " + label ; 
            yupChain = yupChain.required(config.msg);
        }

        if (config.min || config.min === 0) {
            yupChain = yupChain.min(config.min);
        }

        if (config.max) {
            yupChain = yupChain.max(config.max);
        }

        if (config.matches) {
            yupChain = yupChain.matches(config.matches, config.labelmatches);
        }

        return yupChain;
    },
    boolean(label: any, config?: any) {
        return yup.bool().default(false).label(label);
    },
    relationToOne(label: any, config?: any) {
        config = config || {};

        let yupChain = yup
            .mixed()
            .nullable()
            .label(label)
            .transform((value, originalValue) => {
                if (!originalValue) {
                    return null;
                }

                return originalValue.id;
            });

        if (config.required) {
            yupChain = yupChain.required();
        }

        return yupChain;
    },
    stringArray(label: any, config?: any) {
        config = config || {};

        let yupChain = yup
            .array()
            .compact()
            .ensure()
            .of(
                yup
                    .string()
                    .transform((cv, ov) => {
                        return ov === "" ? null : cv;
                    })
                    .trim()
            )
            .label(label);
        if (config.min || config.min === 0) {
            yupChain = yupChain.min(config.min);
        } else if (config.required) {
            yupChain = yupChain.min(1, i18n.t("msgPleaseSpecify") + " " + label);
        }

        if (config.max) {
            yupChain = yupChain.max(config.max);
        }

        return yupChain;
    },
    array(label: any, config?: any) {
        config = config || {};

        let yupChain = yup.array().nullable().label(label);

        if (config.required || config.min) {
            yupChain = yupChain.required();
        }

        if (config.min || config.min === 0) {
            yupChain = yupChain.min(config.min);
        } else if (config.required) {
            yupChain = yupChain.min(1);
        }

        if (config.max) {
            yupChain = yupChain.max(config.max);
        }

        return yupChain;
    },
    relationToMany(label: any, config?: any) {
        config = config || {};

        let yupChain = yup
            .array()
            .nullable()
            .label(label)
            .transform((value, originalValue) => {
                if (!originalValue || !originalValue.length) {
                    return [];
                }

                return originalValue.map((item: any) => item.id);
            });

        if (config.required || config.min) {
            yupChain = yupChain.required();
        }

        if (config.min || config.min === 0) {
            yupChain = yupChain.min(config.min);
        } else if (config.required) {
            yupChain = yupChain.min(1);
        }

        if (config.max) {
            yupChain = yupChain.max(config.max);
        }

        return yupChain;
    },
    integer(label: any, config?: any) {
        config = config || {};

        let yupChain = yup
            .number()
            .transform((cv, ov) => {
                return ov === "" ? null : cv;
            })
            .integer()
            .nullable()
            .label(label);
        if (config.required) {
            config.msg = i18n.t("msgPleaseSpecify") + " " + label;
            yupChain = yupChain.required(config.msg);
        }
        if (config.min || config.min === 0) {
            yupChain = yupChain.min(config.min);
        }

        if (config.max) {
            yupChain = yupChain.max(config.max);
        }

        return yupChain;
    },
    images(label: any, config?: any) {
        config = config || {};

        let yupChain = yup.array().nullable().label(label);

        if (config.required || config.min) {
            yupChain = yupChain.required();
        }

        if (config.min || config.min === 0) {
            yupChain = yupChain.min(config.min);
        } else if (config.required) {
            yupChain = yupChain.min(1);
        }

        if (config.max) {
            yupChain = yupChain.max(config.max);
        }

        return yupChain;
    },
    files(label: any, config?: any) {
        config = config || {};

        let yupChain = yup.array().compact().ensure().nullable().label(label);

        if (config.required || config.min) {
            yupChain = yupChain.required();
        }

        if (config.min || config.min === 0) {
            yupChain = yupChain.min(config.min);
        } else if (config.required) {
            yupChain = yupChain.min(1);
        }

        if (config.max) {
            yupChain = yupChain.max(config.max);
        }

        return yupChain;
    },
    enumerator(label: any, config?: any) {
        config = config || {};

        let yupChain = yup
            .string()
            .transform((cv, ov) => {
                return ov === "" ? null : cv;
            })
            .label(label)
            .nullable()
            .oneOf([null, ...(config.options || [])]);

        if (config.required) {
            yupChain = yupChain.required(i18n.t("select"));
        }

        return yupChain;
    },
    email(label: any, config?: any) {
        config = config || {};

        let yupChain = yup
            .string()
            .transform((cv, ov) => {
                return ov === "" ? null : cv;
            })
            .nullable()
            .trim()
            .label(label)
            .email(i18n.t("msgEmilInvalid"));
        if (config.required) {
            config.msg = i18n.t("msgPleaseSpecify") + " " + label;
            yupChain = yupChain.required(config.msg);
        }

        if (config.min || config.min === 0) {
            yupChain = yupChain.min(config.min);
        }

        if (config.max) {
            yupChain = yupChain.max(config.max);
        }

        if (config.matches) {
            yupChain = yupChain.matches(config.matches);
        }

        return yupChain;
    },
    decimal(label: any, config?: any) {
        config = config || {};
        let yupChain = yup
            .number()
            .transform((cv, ov) => {
                return ov === "" ? null : cv;
            })
            .nullable()
            .label(label);

        if (config.required) {
            config.msg = i18n.t("msgPleaseSpecify") + " " + label;
            yupChain = yupChain.required(config.msg);
        }

        if (config.min || config.min === 0) {
            yupChain = yupChain.min(config.min);
        }

        if (config.max) {
            yupChain = yupChain.max(config.max);
        }

        return yupChain;
    },
    datetime(label: any, config?: any) {
        config = config || {};
        let yupChain = yup
            .mixed()
            .nullable()
            .label(label)
            .transform((value, originalValue) =>
                value ? moment(originalValue, "YYYY-MM-DDTHH:mm:ss").toISOString() : null
            );
        if (config.required) {
            yupChain = yupChain.required(i18n.t("msgPleaseSpecify") + " " + label);
        }

        return yupChain;
    },
    datetimeRange(label: any, config?: any) {
        config = config || {};
        let yupChain = yup.array().of(yup
            .mixed()
            .nullable()
            .label(label)
            .transform((value, originalValue) =>
                value ? moment(value).format("YYYY-MM-DDTHH:mm:ss") : null
            ));

        if (config.required) {
            yupChain = yupChain.required();
        }

        return yupChain;
    },
    date(label: any, config?: any) {
        config = config || {};
        let yupChain = yup
            .mixed()
            .nullable()
            .label(label)
            .test("is-date", i18n.t("msgPleaseSpecify"), (value) => {
                if (!value) {
                    return true;
                }

                return moment(value, "YYYY-MM-DD").isValid();
            })
            .transform((value) =>
                value ? moment(value).format("YYYY-MM-DD") : null
            );
        if (config.required) {
            config.msg = i18n.t("msgPleaseSpecify") + " " + label;
            yupChain = yupChain.required(config.msg);
        }

        return yupChain;
    },
    time(label: any, config?: any) {
        config = config || {};
        let yupChain = yup
            .mixed()
            .nullable()
            .label(label)
            .test("is-time", i18n.t("msgPleaseSpecify"), (value) => {
                if (!value) {
                    return true;
                }

                return moment(value, "HH:mm:ss").isValid();
            })
            .transform((value) =>
                value ? moment(value).format("HH:mm:ss") : null
            );
        if (config.required) {
            config.msg = i18n.t("msgPleaseSpecify") + " " + label;
            yupChain = yupChain.required(config.msg);
        }

        return yupChain;
    },
    dateValue(label: any, config?: any) {
        config = config || {};
        let yupChain = yup
            .date()
            .nullable()
            .label(label)
            .transform((v) => {
                return (v instanceof Date && !isNaN(v.getTime()) ? v : null)
            });

        if (config.min != null && config.max != null) {
            // yupChain = yupChain.min(new Date(config.min), `โปรดระบุ ${label} ให้ถูกต้อง`) 
            // yupChain = yupChain.max(new Date(config.max), `โปรดระบุ ${label} ให้ถูกต้อง`)
            yupChain = yupChain.min(new Date(config.min), (i18n.t("msgPleaseSpecify") + " " + label + " " + i18n.t("msgCorrectly")) ) 
            yupChain = yupChain.max(new Date(config.max), (i18n.t("msgPleaseSpecify") + " " + label + " " + i18n.t("msgCorrectly")))
        }

        if (config.required) {
            yupChain = yupChain.required(i18n.t("msgPleaseSpecify") + " " + label);
        }
        return yupChain;
    },
    confirmPassword(label, config?) {
        config = config || {};
        let yupChain = yup
          .string()
          .transform((cv, ov) => {
            return ov === "" ? null : cv;
          })
          .nullable()
          .trim()
          .label(label);
    
        if (config.required) {      
          config.msg = i18n.t("msgPleaseSpecify") + " " + label;
          yupChain.required(config.msg)
        }
        if (config.required) {
          config.msg = i18n.t("msgPleaseSpecify") + " " + label;
          yupChain = yupChain.required(config.msg);
        }
    
        if (config.min || config.min === 0) {
          yupChain = yupChain.min(config.min);
        }
    
        if (config.max) {
          yupChain = yupChain.max(config.max);
        }
    
        if (config.regex) {
          let Msg = IsNullOrUndefined(config.matches) ? "" : config.matches;
          yupChain = yupChain.matches(config.regex, Msg);
        }
    
        if (config.matchefield) {
          let Msg = IsNullOrUndefined(config.matchelabel)
            // ?  currentLanguage() == "th" ?  "รหัสผ่านไม่ตรงกัน" : "Passwords don't match." 
            ? i18n.t("msgConfirmPassword")
            : config.matchelabel;
          yupChain = yupChain.oneOf([yup.ref(config.matchefield), null], Msg);
        }
    
        return yupChain;
    },
};

export default yupFormSchemas;

export const RegexpPasswork = () => {
    let regexp6 = "((?=.*[a-z])(?=.*[A-Z])(?!.*[ก-ฮ])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,}))"; //พิมพ์เล็กและพิมพ์ใหญ่และตัวเลขและอักขระพิเศษ
    // let egexp = "^(" + regexp1 + "|" + regexp2 + "|" + regexp3 + "|" + regexp4 + "|" + regexp5 + "|" + regexp6 + ")"
    let egexp = "^(" + regexp6 + ")";

    return egexp;
};

export const RegexpPassword = () => {

    let regexp1 = "((?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,}))";//พิมพ์ใหญ่และตัวเลขและอักขระพิเศษ
    let regexp2 = "((?=.*[A-Z])(?=.*[0-9])(?=.*[a-z])(?=.{8,}))";
    let regexp3 = "((?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,}))";
    let regexp4 = "((?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,}))";
    let regexp5 = "((?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,}))";
    let regexp6 = "((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,}))";//พิมพ์เล็กและพิมพ์ใหญ่และตัวเลขและอักขระพิเศษ 
    let egexp = "^(" + regexp1 + "|" + regexp2 + "|" + regexp3 + "|" + regexp4 + "|" + regexp5 + "|" + regexp6 + ")"
    return egexp;
}

export const MsgValidate = {
    PleaseSpecify: "โปรดระบุ",
    Passwork: "รหัสผ่านต้องมีอักขระอย่างน้อย 8 ตัวและมีอย่างน้อยสามรายการต่อไปนี้: ตัวพิมพ์ใหญ่, ตัวพิมพ์เล็ก, ตัวเลข, สัญลักษณ์",
    PassworkEN: "password must be at least 8 characters long and contain: a uppercase letter, an lowercase letter, a number, a sign. (!, @, #, $, %, ^, &, * )",
    InvalidEmail: "อีเมลไม่ถูกต้อง",
    ConfirmPassword: "รหัสผ่านไม่ถูกต้อง"
}