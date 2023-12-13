using API.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API.DataAccess
{
    /// <summary>
    /// Class responsible for generating JSON Web Tokens (JWT) for user authentication.
    /// </summary>
    public class Jwt
    {
        /// <summary>
        /// Gets or sets the secret key used for signing the JWT.
        /// </summary>
        public string Key { get; set; }
        /// <summary>
        /// Gets or sets the duration for which the generated JWT is valid, in minutes.
        /// </summary>
        public string Duration { get; set; }

        /// <summary>
        /// Initializes a new instance of the Jwt class.
        /// </summary>
        /// <param name="Key">Secret key used for signing the JWT.</param>
        /// <param name="Duration">Duration for which the generated JWT is valid, in minutes.</param>
        public Jwt(string? Key, string? Duration)
        {
            // Ensure that Key and Duration are not null, set default values if needed
            this.Key = Key ?? "";
            this.Duration = Duration ?? "";
        }

        /// <summary>
        /// Generates a JWT for the provided user information.
        /// </summary>
        /// <param name="user">User object containing information to be included in the JWT claims.</param>
        /// <returns>Generated JWT as a string.</returns>
        public string GenerateToken(User user)
        {
            // Create a symmetric security key from the provided secret key
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.Key));

            // Create signing credentials using the security key and HMACSHA256 algorithm
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Define claims to be included in the JWT payload
            var claims = new[]
            {
                new Claim("id", user.Id.ToString()),
                new Claim("firstName", user.FirstName),
                new Claim("lastName", user.LastName),
                new Claim("mobile", user.Mobile),
                new Claim("email", user.Email),
                new Claim("blocked", user.Blocked.ToString()),
                new Claim("active", user.Active.ToString()),
                new Claim("createdAt", user.CreatedOn),
                new Claim("userType", user.UserType.ToString())
            };

            // Create a JWT with specified issuer, audience, claims, expiration, and signing credentials
            var jwtToken = new JwtSecurityToken(
                issuer: "localhost",
                audience: "localhost",
                claims: claims,
                expires: DateTime.Now.AddMinutes(Int32.Parse(this.Duration)),
                signingCredentials: credentials
                );

            // Write the JWT token as a string
            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }
    }
}
