import CreatePage from "../pages/v2/create/create-page"

const create = new CreatePage()

describe('test', () => {

  it('does stuff', () => {
    create.visit()
    // cy.visit('localhost:3000/#/create')
    const projectName = 'test-project'
    cy.findByLabelText(/project name/i).type(projectName)
    cy.findByRole('button', {  name: /next: funding cycle/i}).click()
    cy.findByRole('button', {  name: /next: review and deploy/i}).click()
    cy.findByRole('button', {  name: /connect wallet to deploy/i}).click()
    cy.findByRole('button', {  name: /metamask metamask/i}).click()
    cy.acceptMetamaskAccess(undefined)
    cy.findByRole('button', {  name: /deploy project to .*/i}).click()
    cy.wait(5000)
    cy.confirmMetamaskTransaction(undefined) 
    cy.url().should('contain', '#/v2/p/')
    cy.wait(1000)
    cy.get('body').then($body => {
      if ($body.find('.ant-btn-primary').length) {
        const button = $body.find('.ant-btn-primary')[0]
        button.click()
      }
    })
    cy.findByRole('button', {name: /later/i}).click()
    cy.findByRole('heading', {name: projectName})
    // cy.confirmMetaMaskTransaction()
  })
})