import joi from "joi"

const createCardSchema = joi.object({
    id: joi.number().required(),
    type: joi.string().required()
})

export default createCardSchema