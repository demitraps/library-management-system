using API.DataAccess;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

// CORS policy name for specific origins
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Create a new instance of the web application builder
var builder = WebApplication.CreateBuilder(args);


// Add services to the container.

// Add controllers for handling HTTP requests
builder.Services.AddControllers();


// Configure Swagger/OpenAPI for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Cross-Origin Resource Sharing (CORS)
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        // Allow requests from http://localhost:4200 with any headers and methods
        policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod();
    });
});

// Configure JSON Web Token (JWT) authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(x =>
{
    x.TokenValidationParameters = new TokenValidationParameters
    {
        // Validate issuer, audience, lifetime, and signing key
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "localhost",
        ValidAudience = "localhost",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["jwt:Key"])),
        ClockSkew = TimeSpan.Zero
    };
});

// Configure Dependency Injection (DI) for DataAccess
builder.Services.AddSingleton<IDataAccess, DataAccess>();

// Build the web application
var app = builder.Build();

// Enable Swagger UI for development environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Redirect HTTP requests to HTTPS
app.UseHttpsRedirection();

// Enable CORS for specified origins
app.UseCors(MyAllowSpecificOrigins);

// Enable JWT authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

// Map controllers to handle incoming HTTP requests
app.MapControllers();

// Start the application
app.Run();
