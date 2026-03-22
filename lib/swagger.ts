import { createSwaggerSpec } from "next-swagger-doc";

export function getApiDocs() {
  return createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Cartlyn Store API",
        version: "1.0.0",
        description: "REST API for the Cartlyn Store e-commerce platform"
      },
      tags: [
        { name: "Health", description: "Health check" },
        { name: "Products", description: "Product management" }
      ],
      components: {
        schemas: {
          Seller: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" }
            }
          },
          Product: {
            type: "object",
            properties: {
              id: { type: "string", format: "cuid" },
              name: { type: "string" },
              price: { type: "number", format: "float" },
              description: { type: "string" },
              imageUrl: { type: "string", format: "uri" },
              sellerId: { type: "string" },
              publishedAt: { type: "string", format: "date-time" },
              active: { type: "boolean" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
              seller: { $ref: "#/components/schemas/Seller" }
            }
          },
          Pagination: {
            type: "object",
            properties: {
              limit: { type: "integer" },
              nextCursor: { type: "string", nullable: true },
              hasNextPage: { type: "boolean" }
            }
          },
          Error: {
            type: "object",
            properties: {
              error: { type: "string" },
              details: { type: "array", items: { type: "object" } }
            }
          }
        }
      },
      paths: {
        "/api/health": {
          get: {
            tags: ["Health"],
            summary: "Health check",
            description: "Verifies that the API and database are operational",
            responses: {
              "200": {
                description: "Service is healthy",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        status: { type: "string", example: "healthy" }
                      }
                    }
                  }
                }
              },
              "503": {
                description: "Service is unhealthy",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        status: { type: "string", example: "unhealthy" }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/api/products": {
          get: {
            tags: ["Products"],
            summary: "List products",
            description:
              "Returns a paginated list of products with optional filtering",
            parameters: [
              {
                name: "query",
                in: "query",
                schema: { type: "string" },
                description: "Search term"
              },
              {
                name: "cursor",
                in: "query",
                schema: { type: "string" },
                description: "Pagination cursor (product ID)"
              },
              {
                name: "limit",
                in: "query",
                schema: { type: "integer", default: 12 },
                description: "Number of results per page"
              },
              {
                name: "minPrice",
                in: "query",
                schema: { type: "number" },
                description: "Minimum price filter"
              },
              {
                name: "maxPrice",
                in: "query",
                schema: { type: "number" },
                description: "Maximum price filter"
              },
              {
                name: "sellerId",
                in: "query",
                schema: { type: "string" },
                description: "Filter by seller ID"
              }
            ],
            responses: {
              "200": {
                description: "Paginated list of products",
                headers: {
                  "Cache-Control": {
                    schema: { type: "string" },
                    description:
                      "public, s-maxage=60, stale-while-revalidate=300"
                  }
                },
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        products: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Product" }
                        },
                        pagination: {
                          $ref: "#/components/schemas/Pagination"
                        }
                      }
                    }
                  }
                }
              },
              "400": {
                description: "Invalid query parameters",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" }
                  }
                }
              }
            }
          }
        },
        "/api/products/{id}": {
          get: {
            tags: ["Products"],
            summary: "Get product by ID",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" }
              }
            ],
            responses: {
              "200": {
                description: "Product details",
                headers: {
                  "Cache-Control": {
                    schema: { type: "string" },
                    description:
                      "public, s-maxage=60, stale-while-revalidate=300"
                  }
                },
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Product" }
                  }
                }
              },
              "404": {
                description: "Product not found",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
}
