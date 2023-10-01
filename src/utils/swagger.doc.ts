import swaggerJSDoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Twitter challenge',
      version: '1.0.0',
      description: 'API documentation for express API'
    }
  },
  apis: ['src/domains/**/**/*.ts']
}

export const swaggerSpec = swaggerJSDoc(options)
