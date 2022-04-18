import * as companyRepository from "../repositories/companyRepository.js"
import * as employeeRepository from "../repositories/employeeRepository.js"
import * as cardRepository from "../repositories/cardRepository.js"
import * as paymentRepository from "../repositories/paymentRepository.js"
import * as rechargeRepository from "../repositories/rechargeRepository.js"

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

export async function rechargeCard(apiKey: string, cardId: number, value: number) {

    const findApiKey = await companyRepository.findByApiKey(apiKey)
    if (!findApiKey) return null;

    const card = await findCardById(cardId)
    if (!card) return null

    const checkExpired = isExpired(card.expirationDate)
    if (checkExpired === false) return null;

    if (value <= 0) return null;

    const rechargeData = { cardId, amount: value }

    await rechargeRepository.insert(rechargeData)


}

export async function findCardById(cardId: number) {
    const card = await cardRepository.findById(cardId)
    if (!card) return null
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

async function createHashCode(sensibleData: string) {
    const hash = bcrypt.hashSync(sensibleData, 10)

    return hash

}

export async function activateCard(idCard: number, CVC: string, password: string) {

    const findCard = await cardRepository.findById(idCard);
    console.log(findCard)
    if (!findCard) return null

    const checkExpired = isExpired(findCard.expirationDate)
    if (checkExpired === false) return null;

    if (findCard.password != null) return null

    const checkCVC = compareHashData(CVC, findCard.securityCode)
    if (!checkCVC) return null


    const checkPasswordNumbers = isNaN(parseInt(password)) && password.length != 4
    if (!checkPasswordNumbers) return null

    findCard.password = await createHashCode(password)

    await cardRepository.update(idCard, findCard)


}

function isExpired(date: string): boolean {
    const dateFormat = date.split("/")

    const isExpired = dayjs(`${dateFormat[0]}/31/${dateFormat[1]}`).isBefore(dayjs(Date.now()))

    return isExpired
}

function compareHashData(sensibleData: string, hash: string): boolean {

    const result = bcrypt.compareSync(sensibleData, hash)

    return result
}

export async function getHistoric(idCard: number) {
    const transaction = await paymentRepository.findByCardId(idCard);
    const recharges = await paymentRepository.findByCardId(idCard)


    const totalTransactions: any = sumValues(transaction, "amounth")
    const totalRecharge: any = sumValues(recharges, "amounth")

    const balance: number = totalRecharge - totalTransactions;
    return {
        balance,
        transaction,
        recharges
    }
}
function sumValues(array: any[], key: string): number {

    const keyValues: any[] = array.map(el => el[key])

    return keyValues.reduce((current: number, sum: number) => sum + current, 0);

}








