import * as companyRepository from "../repositories/companyRepository.js"
import * as employeeRepository from "../repositories/employeeRepository.js"
import * as cardRepository from "../repositories/cardRepository.js"
import { faker } from "@faker-js/faker"
import { default as dayjs } from "dayjs"
import * as bcrypt from "bcrypt"

export async function createCard(headers: string, employeeId: number, cardType: cardRepository.TransactionTypes) {
    const apiKey = await companyRepository.findByApiKey(headers)
    if (!apiKey) return null;

    const verifyIdEmployee = await employeeRepository.findById(employeeId)
    if (!verifyIdEmployee) return null;

    const verifyCardUser = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId)
    if (verifyCardUser) return null;

    const employee = verifyIdEmployee

    const cardData = await createCardInfos(employee.id, employee.fullName, cardType)

    cardData.securityCode = await createHashCode(cardData.securityCode)

    await cardRepository.insert(cardData);

}

export async function createCardInfos(employeeId: number, employeeFullName: string, cardType: cardRepository.TransactionTypes) {

    const cardholderName = generateHolderName(employeeFullName);
    const number: string = faker.finance.creditCardNumber("MasterCard")
    const securityCode: string = faker.finance.creditCardCVV()
    const expirationDate: string = generateDateExpiration()
    const type = cardType
    const isBlocked: boolean = false

    return {
        employeeId,
        number,
        cardholderName,
        securityCode,
        expirationDate,
        password: null,
        isVirtual: false,
        originalCardId: null,
        isBlocked,
        type
    }

}
function generateHolderName(fullName: string) {
    const fullNameArray = fullName.split(" ")

    const firstName = fullNameArray.shift()

    const lastName = fullNameArray.pop()

    const middleName = fullNameArray.filter(el => el.length >= 3).map(el => el.slice(0, 1))

    const cardHolderName = [firstName, ...middleName, lastName].join(" ").toUpperCase()

    return cardHolderName
}
function generateDateExpiration() {
    return dayjs(Date.now()).add(5, "year").format('MM/YYYY')
}

async function createHashCode(securityCode: string) {
    const hash = bcrypt.hashSync(securityCode, 10)

    return hash

}