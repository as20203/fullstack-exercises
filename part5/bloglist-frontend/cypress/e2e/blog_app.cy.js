describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('login page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('blogs')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.get('.error').contains('Wrong username or passsword.')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'mluukkai', password: 'salainen'
      }).then(response => {
        console.log({ body: response.body })
        localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })


    it('A blog can be created', function() {
      const blog = {
        title: 'mluukkai blog',
        author: 'Jawad Zaheer',
        url: 'http://mluukkaiblog.com'
      }
      cy.get('#blog-form-button').click()
      cy.get('#title').type(blog.title)
      cy.get('#author').type(blog.author)
      cy.get('#url').type(blog.url)
      cy.get('#add-blog-button').click()
      //Check the blog title in the blog list.
      cy.get('#blog-title').contains(blog.title)
    })

    describe('And if blogs exist', function() {
      beforeEach(function () {
        cy.createBlog({
          title: 'mluukkai blog 1',
          author: 'Jawad Zaheer',
          url: 'http://mluukkaiblog-1.com'
        })
        cy.createBlog({
          title: 'mluukkai blog 2',
          author: 'Jawad Zaheer',
          url: 'http://mluukkaiblog-2.com'
        })
        cy.createBlog({
          title: 'mluukkai blog 3',
          author: 'Jawad Zaheer',
          url: 'http://mluukkaiblog-3.com'
        })

        cy.createBlog({
          title: 'mluukkai blog 4',
          author: 'Jawad Zaheer',
          url: 'http://mluukkaiblog-4.com'
        })
      })

      it('A blog can be liked.', function() {
        cy.contains('mluukkai blog 1 Matti Luukkainen')
          .contains('view')
          .click()
        cy.contains('mluukkai blog 1 Matti Luukkainen')
          .contains('like')
          .click()
        cy.contains('mluukkai blog 1 Matti Luukkainen')
          .should('contain', 'likes 1')
      })

      it('A blog can be deleted.', function() {
        cy.contains('mluukkai blog 1 Matti Luukkainen')
          .contains('view')
          .click()
        cy.contains('mluukkai blog 1 Matti Luukkainen')
          .contains('remove')
          .click()
        cy.contains('mluukkai blog 1 Matti Luukkainen')
          .should('not.exist');
      })


      it('Blogs can be sorted by likes', function() {

        //Liked 1 time.
        cy.contains('mluukkai blog 1 Matti Luukkainen')
          .contains('view')
          .click()
        cy.contains('mluukkai blog 1 Matti Luukkainen')
          .contains('like')
          .click()

        //Liked 3 times.
        cy.contains('mluukkai blog 2 Matti Luukkainen')
          .contains('view')
          .click()
        cy.contains('mluukkai blog 2 Matti Luukkainen')
          .contains('like')
          .click()
        cy.wait(500)
        cy.contains('mluukkai blog 2 Matti Luukkainen')
          .contains('like')
          .click()
        cy.wait(500)
        cy.contains('mluukkai blog 2 Matti Luukkainen')
          .contains('like')
          .click()

        //Liked 4 times
        cy.contains('mluukkai blog 3 Matti Luukkainen')
          .contains('view')
          .click()
        cy.contains('mluukkai blog 3 Matti Luukkainen')
          .contains('like')
          .click()
        cy.wait(500)
        cy.contains('mluukkai blog 3 Matti Luukkainen')
          .contains('like')
          .click()
        cy.wait(500)
        cy.contains('mluukkai blog 3 Matti Luukkainen')
          .contains('like')
          .click()
        cy.wait(500)
        cy.contains('mluukkai blog 3 Matti Luukkainen')
          .contains('like')
          .click()

        //Liked 5 times.
        cy.contains('mluukkai blog 4 Matti Luukkainen')
          .contains('view')
          .click()
        cy.contains('mluukkai blog 4 Matti Luukkainen')
          .contains('like')
          .click()
        cy.wait(500)
        cy.contains('mluukkai blog 4 Matti Luukkainen')
          .contains('like')
          .click()
        cy.wait(500)
        cy.contains('mluukkai blog 4 Matti Luukkainen')
          .contains('like')
          .click()
        cy.contains('mluukkai blog 4 Matti Luukkainen')
          .contains('like')
          .click()
        cy.wait(500)
        cy.contains('mluukkai blog 4 Matti Luukkainen')
          .contains('like')
          .click()

        //Test
        cy.get('.blog').eq(0).should('contain', 'mluukkai blog 4')
        cy.get('.blog').eq(1).should('contain', 'mluukkai blog 3')
        cy.get('.blog').eq(2).should('contain', 'mluukkai blog 2')
        cy.get('.blog').eq(3).should('contain', 'mluukkai blog 1')

      })

    })



  })
})