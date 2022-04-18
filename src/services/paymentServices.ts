import * as paymentRepository from "../repositories/paymentRepository.js"
import * as cardsRepositories from "../repositories/cardRepository.js"
import * as businessRepository from "../repositories/businessRepository.js"
import { default as dayjs } from "dayjs"
import compareHashData, { getHistoric } from "./cardsServices.js"


export async function posPayment(id: number, password: string, businessId: number, amount: number) {
    if (amount <= 0) {
        throw {
            type: "Unauthorized",
            message: "amount negative"
        }
    }

    const findCard = await cardsRepositories.findById(id)
    if (!findCard) {
        throw {
            type: "Unauthorized"
        }
    }
    console.log(findCard)

    if (isExpired(findCard.expirationDate)) {
        throw {
            type: "Not_Found"
        }
    };

    if (!compareHashData(password, findCard.password)) {
        throw {
            type: "Unauthorized",
            message: "Incorrect password"
        }
    }

    const verifyBusiness = await businessRepository.findById(businessId)
    if (!verifyBusiness) {
        throw {
            type: "Not_Found"
        }
    };

    if (findCard.type !== verifyBusiness.type) {
        throw {
            type: "Not_Found"
        }
    };

    const amountCard = await getHistoric(id)
    if (amount > amountCard.balance) {
        throw {
            type: "Unauthorized",
            message: "insufficient funds"
        }
    };

    await paymentRepository.insert({ cardId: findCard.id, businessId, amount })


}

function isExpired(date: string): boolean {
    const dateFormat = date.split("/")

    const isExpired = dayjs(`${dateFormat[0]}/31/${dateFormat[1]}`).isBefore(dayjs(Date.now()))

    return isExpired
}



