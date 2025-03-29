describe('Yahoo Japan E2E Test', () => {
    it('should load the Yahoo Japan homepage', () => {
        cy.visit('https://www.yahoo.co.jp/')
        cy.url().should('include', 'yahoo.co.jp')
        cy.get('title').should('have.text', 'Yahoo! JAPAN')
    })

    it('should search for a term', () => {
        cy.visit('https://www.yahoo.co.jp/')
        cy.get('input[name="p"]').type('Cypress{enter}')
        cy.url().should('include', 'search')
        cy.get('h3').should('be.visible')
    })

    it('should navigate to news section', () => {
        cy.visit('https://www.yahoo.co.jp/')
        cy.contains('ニュース').click()
        cy.url().should('include', 'news')
        cy.get('h1').should('have.text', 'Yahoo!ニュース')
    })
})