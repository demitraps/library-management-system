using API.DataAccess;
using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    /// <summary>
    /// Controller for managing library-related operations.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class LibraryController : ControllerBase
    {
        private readonly IDataAccess library;
        private readonly IConfiguration configuration;

        /// <summary>
        /// Constructor for LibraryController.
        /// </summary>
        /// <param name="library">DataAccess service for library operations.</param>
        /// <param name="configuration">Configuration for the controller (optional).</param>
        public LibraryController(IDataAccess library, IConfiguration configuration = null)
        {
            this.library = library;
            this.configuration = configuration;
        }

        /// <summary>
        /// Creates a new user account.
        /// </summary>
        /// <param name="user">User object containing account details.</param>
        /// <returns>ActionResult with a success message or email availability status.</returns>
        [HttpPost("CreateAccount")]
        public IActionResult CreateAccount(User user)
        {
            // Check if email is available
            if (!library.IsEmailAvailable(user.Email))
            {
                return Ok("Email is not available.");
            }

            // Set user properties and create the user
            user.CreatedOn = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            user.UserType = UserType.USER;
            library.CreateUser(user);
            return Ok("Account created successfully.");
        }

        /// <summary>
        /// Authenticates a user and returns a JWT token upon successful login.
        /// </summary>
        /// <param name="email">User email for authentication.</param>
        /// <param name="password">User password for authentication.</param>
        /// <returns>ActionResult with a JWT token or "Invalid" for unsuccessful login.</returns>
        [HttpGet("Login")]
        public IActionResult Login(string email, string password)
        {
            // Authenticate user
            if (library.AuthenticateUser(email, password, out User? user))
            {
                if (user != null)
                {
                    // Generate JWT token
                    var jwt = new Jwt(configuration["Jwt:Key"], configuration["Jwt:Duration"]);
                    var token = jwt.GenerateToken(user);
                    return Ok(token);
                }
            }
            return Ok("Invalid");
        }

        /// <summary>
        /// Gets a list of all books in the library.
        /// </summary>
        /// <returns>ActionResult with a list of books.</returns>
        [HttpGet("GetAllBooks")]
        public IActionResult GetALlBooks()
        {
            var books = library.GetAllBooks();
            var booksToSend = books.Select(book => new
            {
                book.Id,
                book.Title,
                book.Category.Category,
                book.Category.SubCategory,
                book.Price,
                Available = !book.Ordered,
                book.Author
            }).ToList();
            return Ok(booksToSend);
        }

        /// <summary>
        /// Orders a book for a user.
        /// </summary>
        /// <param name="userId">ID of the user placing the order.</param>
        /// <param name="bookId">ID of the book to be ordered.</param>
        /// <returns>ActionResult indicating success or failure of the book order.</returns>
        [HttpGet("OrderBook/{userId}/{bookId}")]
        public IActionResult OrderBook(int userId, int bookId)
        {
            var result = library.OrderBook(userId, bookId) ? "success" : "fail";
            return Ok(result);
        }

        /// <summary>
        /// Gets the orders of a specific user.
        /// </summary>
        /// <param name="id">ID of the user.</param>
        /// <returns>ActionResult with a list of orders for the specified user.</returns>
        [HttpGet("GetOrders/{id}")]
        public IActionResult GetOrders(int id)
        {
            return Ok(library.GetOrdersOfUser(id));
        }

        /// <summary>
        /// Gets all orders in the library.
        /// </summary>
        /// <returns>ActionResult with a list of all orders in the library.</returns>
        [HttpGet("GetAllOrders")]
        public IActionResult GetAllOrders()
        {
            return Ok(library.GetAllOrders());
        }

        /// <summary>
        /// Returns a book that was previously borrowed by a user.
        /// </summary>
        /// <param name="bookId">ID of the book to be returned.</param>
        /// <param name="userId">ID of the user returning the book.</param>
        /// <returns>ActionResult indicating success or failure of the book return.</returns>
        [HttpGet("ReturnBook/{bookId}/{userId}")]
        public IActionResult ReturnBook(string bookId, string userId)
        {
            var result = library.ReturnBook(int.Parse(userId), int.Parse(bookId));
            return Ok(result == true ? "success" : "not returned");
        }

        /// <summary>
        /// Gets a list of all users in the library.
        /// </summary>
        /// <returns>ActionResult with a list of user details.</returns>
        [HttpGet("GetAllUsers")]
        public IActionResult GetAllUsers()
        {
            var users = library.GetUsers();
            var result = users.Select(user => new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.Mobile,
                user.Blocked,
                user.Active,
                user.CreatedOn,
                user.UserType,
                user.Fine
            });
            return Ok(result);
        }

        /// <summary>
        /// Changes the block status of a user.
        /// </summary>
        /// <param name="status">New block status (1 for blocked, 0 for unblocked).</param>
        /// <param name="id">ID of the user.</param>
        /// <returns>ActionResult indicating success of the operation.</returns>
        [HttpGet("ChangeBlockStatus/{status}/{id}")]
        public IActionResult ChangeBlockStatus(int status, int id)
        {
            if (status == 1)
            {
                library.BlockUser(id);
            }
            else
            {
                library.UnblockUser(id);
            }
            return Ok("success");
        }

        /// <summary>
        /// Changes the enable status of a user.
        /// </summary>
        /// <param name="status">New enable status (1 for active, 0 for inactive).</param>
        /// <param name="id">ID of the user.</param>
        /// <returns>ActionResult indicating success of the operation.</returns>
        [HttpGet("ChangeEnableStatus/{status}/{id}")]
        public IActionResult ChangeEnableStatus(int status, int id)
        {
            if (status == 1)
            {
                library.ActivateUser(id);
            }
            else
            {
                library.DeactivateUser(id);
            }
            return Ok("success");
        }

        /// <summary>
        /// Gets all book categories in a hierarchical structure.
        /// </summary>
        /// <returns>ActionResult with a hierarchical structure of all book categories.</returns>
        [HttpGet("GetAllCategories")]
        public IActionResult GetAllCategories()
        {
            var categories = library.GetAllCategories();
            var x = categories.GroupBy(c => c.Category).Select(item =>
            {
                return new 
                { 
                    name = item.Key, 
                    children = item.Select(item => new { name = item.SubCategory }).ToList() 
                };
            }).ToList();
            return Ok(x);
        }

        /// <summary>
        /// Inserts a new book into the library.
        /// </summary>
        /// <param name="book">Book object containing details of the book to be inserted.</param>
        /// <returns>ActionResult indicating success or failure of the insertion.</returns>
        [HttpPost("InsertBook")]
        public IActionResult InsertBook(Book book)
        {
            // Trim and normalize input before inserting
            book.Title = book.Title.Trim();
            book.Author = book.Author.Trim();
            book.Category.Category = book.Category.Category.ToLower();
            book.Category.SubCategory = book.Category.SubCategory.ToLower();

            // Insert new book
            library.InsertNewBook(book);
            return Ok("Inserted");
        }

        /// <summary>
        /// Deletes a book from the library by its ID.
        /// </summary>
        /// <param name="id">ID of the book to be deleted.</param>
        /// <returns>ActionResult indicating success or failure of the deletion.</returns>
        [HttpDelete("DeleteBook/{id}")]
        public IActionResult DeleteBook(int id)
        {
            var returnResult = library.DeleteBook(id) ? "success" : "fail";
            return Ok(returnResult);
        }

        /// <summary>
        /// Inserts a new book category into the library.
        /// </summary>
        /// <param name="bookCategory">BookCategory object containing details of the category to be inserted.</param>
        /// <returns>ActionResult indicating success or failure of the insertion.</returns>
        [HttpPost("InsertCategory")]
        public IActionResult InsertCategory(BookCategory bookCategory)
        {
            // Normalize category and subcategory before insertion
            bookCategory.Category = bookCategory.Category.ToLower();
            bookCategory.SubCategory = bookCategory.SubCategory.ToLower();

            // Create new category
            library.CreateCategory(bookCategory);
            return Ok("Inserted");
        }
    }
}
