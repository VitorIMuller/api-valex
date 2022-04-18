import joi from "joi"

const rechargeSchema = joi.object({
    value: joi.number().required()
})


export default rechargeSchema