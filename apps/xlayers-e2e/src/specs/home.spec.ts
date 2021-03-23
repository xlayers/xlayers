describe('Home page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('the landing page should render the getting started button', () => {
    cy.get('.icon_wrapper').should('be.visible');
  });

  it('the getting started button should open the editor', () => {
    cy.get('.icon_wrapper').spread((firstFramework) => {
      firstFramework.click();
    });
    cy.location('hash').should('eq', '#/upload');
  });
});
