import joi from "joi"

const posPurchaseSchema = joi.object({
    id: joi.number().required(),
    password: joi.string().required(),
    idBusiness: joi.number().required(),
    amount: joi.number().required()
})


export default posPurchaseSchema