describe('サンプルテスト: Google', () => {
    it('Googleにアクセスしてタイトルを確認', () => {
      cy.visit('https://www.google.com');
      cy.title().should('include', 'Google');
    });
  });
  