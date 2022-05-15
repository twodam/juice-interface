import Page from "../../page";

export default class CreatePage extends Page {

  visit() {
    cy.visit('/#create')
  }
}