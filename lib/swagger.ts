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
        { name: "Auth", description: "Authentication and registration" },
        { name: "Products", description: "Product management" },
        { name: "Seller", description: "Seller-specific endpoints" },
        { name: "Account", description: "Account management" }
      ],
      components: {
        securitySchemes: {
          sessionCookie: {
            type: "apiKey",
            in: "cookie",
            name: "next-auth.session-token",
            description: "NextAuth.js session cookie"
          }
        },
        schemas: {
          Product: {
            type: "object",
            properties: {
              id: { type: "string", format: "cuid" },
              name: { type: "string" },
              price: { type: "number", format: "float" },
              description: { type: "string" },
              imageUrl: { type: "string", format: "uri" },
              sellerId: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" }
            }
          },
          CreateProductDTO: {
            type: "object",
            required: ["name", "price", "description", "imageUrl"],
            properties: {
              name: { type: "string", minLength: 1, maxLength: 200 },
              price: { type: "number", minimum: 0, exclusiveMinimum: true },
              description: { type: "string", minLength: 10 },
              imageUrl: { type: "string", format: "uri" }
            }
          },
          UpdateProductDTO: {
            type: "object",
            properties: {
              name: { type: "string", minLength: 1, maxLength: 200 },
              price: { type: "number", minimum: 0, exclusiveMinimum: true },
              description: { type: "string", minLength: 10 },
              imageUrl: { type: "string", format: "uri" }
            }
          },
          RegisterDTO: {
            type: "object",
            required: ["email", "password", "name", "role"],
            properties: {
              email: { type: "string", format: "email" },
              password: { type: "string", minLength: 8, maxLength: 64 },
              name: { type: "string", minLength: 2 },
              role: { type: "string", enum: ["CLIENT", "SELLER"] }
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
        "/api/auth/register": {
          post: {
            tags: ["Auth"],
            summary: "Register a new user",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/RegisterDTO" }
                }
              }
            },
            responses: {
              "201": {
                description: "User created successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: { type: "string" },
                        user: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            email: { type: "string" },
                            name: { type: "string" },
                            role: { type: "string" }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "400": {
                description: "Validation error",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" }
                  }
                }
              },
              "409": {
                description: "Email already in use",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" }
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
                        nextCursor: { type: "string", nullable: true }
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
          },
          post: {
            tags: ["Products"],
            summary: "Create a product",
            description: "Creates a new product. Requires SELLER role.",
            security: [{ sessionCookie: [] }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CreateProductDTO" }
                }
              }
            },
            responses: {
              "201": {
                description: "Product created successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: { type: "string" },
                        product: { $ref: "#/components/schemas/Product" }
                      }
                    }
                  }
                }
              },
              "400": {
                description: "Validation error",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" }
                  }
                }
              },
              "401": {
                description: "Unauthorized — SELLER role required",
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
          },
          patch: {
            tags: ["Products"],
            summary: "Update a product",
            description:
              "Partially updates a product. Requires SELLER role and ownership.",
            security: [{ sessionCookie: [] }],
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" }
              }
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UpdateProductDTO" }
                }
              }
            },
            responses: {
              "200": {
                description: "Product updated successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: { type: "string" },
                        product: { $ref: "#/components/schemas/Product" }
                      }
                    }
                  }
                }
              },
              "400": {
                description: "Validation error",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" }
                  }
                }
              },
              "401": {
                description: "Unauthorized",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" }
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
          },
          delete: {
            tags: ["Products"],
            summary: "Delete a product",
            description:
              "Deletes a product. Requires SELLER role and ownership.",
            security: [{ sessionCookie: [] }],
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
                description: "Product deleted successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } }
                    }
                  }
                }
              },
              "401": {
                description: "Unauthorized",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" }
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
        },
        "/api/products/bulk": {
          post: {
            tags: ["Products"],
            summary: "Bulk create products from CSV",
            description:
              "Creates multiple products from a CSV file. Requires SELLER role. CSV columns: name, price, description, imageUrl",
            security: [{ sessionCookie: [] }],
            requestBody: {
              required: true,
              content: {
                "multipart/form-data": {
                  schema: {
                    type: "object",
                    required: ["file"],
                    properties: {
                      file: {
                        type: "string",
                        format: "binary",
                        description: "CSV file with product data"
                      }
                    }
                  }
                }
              }
            },
            responses: {
              "200": {
                description: "Products created (may include partial errors)",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: { type: "string" },
                        created: { type: "integer" },
                        errors: {
                          type: "array",
                          nullable: true,
                          items: {
                            type: "object",
                            properties: {
                              row: { type: "integer" },
                              errors: {
                                type: "array",
                                items: { type: "object" }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "400": {
                description: "No file provided or no valid products found",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" }
                  }
                }
              },
              "401": {
                description: "Unauthorized — SELLER role required",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" }
                  }
                }
              }
            }
          }
        },
        "/api/seller/dashboard": {
          get: {
            tags: ["Seller"],
            summary: "Get seller dashboard",
            description:
              "Returns dashboard statistics for the authenticated seller.",
            security: [{ sessionCookie: [] }],
            responses: {
              "200": {
                description: "Dashboard data",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      description: "Seller dashboard metrics"
                    }
                  }
                }
              },
              "401": {
                description: "Unauthorized — SELLER role required",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" }
                  }
                }
              }
            }
          }
        },
        "/api/account": {
          delete: {
            tags: ["Account"],
            summary: "Delete or deactivate account",
            description:
              "Deletes a CLIENT account or deactivates a SELLER account (soft delete, preserves order history).",
            security: [{ sessionCookie: [] }],
            responses: {
              "200": {
                description: "Account deleted or deactivated successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } }
                    }
                  }
                }
              },
              "401": {
                description: "Not authenticated",
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
