using API.Models;
using Dapper;
using System.Data.SqlClient;

namespace API.DataAccess
{
    /// <summary>
    /// DataAccess class responsible for interacting with the database and performing various operations related to the library.
    /// </summary>
    public class DataAccess : IDataAccess
    {
        private readonly IConfiguration configuration;
        private readonly string DbConnection;

        /// <summary>
        /// Constructor for DataAccess class.
        /// </summary>
        /// <param name="_configuration">Configuration object for accessing configuration settings.</param>
        public DataAccess(IConfiguration _configuration)
        {
            configuration = _configuration;
            DbConnection = configuration["connectionStrings:DBConnect"] ?? "";
        }

        /// <summary>
        /// Creates a new user in the database.
        /// </summary>
        /// <param name="user">User object containing details of the user to be created.</param>
        /// <returns>The number of rows affected in the database.</returns>
        public int CreateUser(User user)
        {
            var result = 0;
            using (var connection = new SqlConnection(DbConnection))
            {
                // Prepare parameters for SQL query
                var parameters = new
                {
                    fn = user.FirstName,
                    ln = user.LastName,
                    em = user.Email,
                    mb = user.Mobile,
                    pwd = user.Password,
                    blk = user.Blocked,
                    act = user.Active,
                    con = user.CreatedOn,
                    type = user.UserType.ToString()
                };
                // SQL query to insert a new user into the database
                var sql = "insert into Users (FirstName, LastName, Email, Mobile, Password, Blocked, Active, CreatedOn, UserType) values (@fn, @ln, @em, @mb, @pwd, @blk, @act, @con, @type);";

                // Execute the query and get the result
                result = connection.Execute(sql, parameters);
            }
            return result;
        }

        /// <summary>
        /// Checks if the specified email is available (not already used) in the database.
        /// </summary>
        /// <param name="email">Email to be checked for availability.</param>
        /// <returns>True if the email is available; otherwise, false.</returns>
        public bool IsEmailAvailable(string email)
        {
            var result = false;

            using (var connection = new SqlConnection(DbConnection))
            {
                // Execute the query and get the result
                result = connection.ExecuteScalar<bool>("select count(*) from Users where Email=@email;", new { email });
            }

            return !result;
        }

        /// <summary>
        /// Authenticates a user based on the provided email and password.
        /// </summary>
        /// <param name="email">Email of the user.</param>
        /// <param name="password">Password of the user.</param>
        /// <param name="user">If authentication is successful, contains the details of the authenticated user; otherwise, null.</param>
        /// <returns>True if authentication is successful; otherwise, false.</returns>
        public bool AuthenticateUser(string email, string password, out User? user)
        {
            var result = false;
            using (var connection = new SqlConnection(DbConnection))
            {
                result = connection.ExecuteScalar<bool>("select count(1) from Users where email=@email and password=@password;", new { email, password });
                if (result)
                {
                    user = connection.QueryFirst<User>("select * from Users where email=@email;", new { email });
                }
                else
                {
                    user = null;
                }
            }
            return result;
        }

        /// <summary>
        /// Retrieves a list of all books from the database, including their categories.
        /// </summary>
        /// <returns>List of Book objects representing all books.</returns>
        public IList<Book> GetAllBooks()
        {
            IEnumerable<Book>? books = null;
            using (var connection = new SqlConnection(DbConnection))
            {
                var sql = "select * from Books;";
                books = connection.Query<Book>(sql);

                foreach (var book in books)
                {
                    sql = "select * from BookCategories where Id=" + book.CategoryId;
                    book.Category = connection.QuerySingle<BookCategory>(sql);
                }
            }
            return books.ToList();
        }

        /// <summary>
        /// Places an order for a book by a specific user.
        /// </summary>
        /// <param name="userId">ID of the user placing the order.</param>
        /// <param name="bookId">ID of the book to be ordered.</param>
        /// <returns>True if the book is successfully ordered; otherwise, false.</returns>
        public bool OrderBook(int userId, int bookId)
        {
            var ordered = false;

            using (var connection = new SqlConnection(DbConnection))
            {
                var sql = $"insert into Orders (UserId, BookId, OrderedOn, Returned) values ({userId}, {bookId}, '{DateTime.Now:yyyy-MM-dd HH:mm:ss}', 0);";
                var inserted = connection.Execute(sql) == 1;
                if (inserted)
                {
                    sql = $"update Books set Ordered=1 where Id={bookId}";
                    var updated = connection.Execute(sql) == 1;
                    ordered = updated;
                }
            }

            return ordered;
        }

        /// <summary>
        /// Retrieves a list of orders for a specific user, including book details.
        /// </summary>
        /// <param name="userId">ID of the user.</param>
        /// <returns>List of Order objects representing the orders of the specified user.</returns>
        public IList<Order> GetOrdersOfUser(int userId)
        {
            IEnumerable<Order> orders;
            using (var connection = new SqlConnection(DbConnection))
            {
                var sql = @"
                    select 
                        o.Id, 
                        u.Id as UserId, CONCAT(u.FirstName, ' ', u.LastName) as Name,
                        o.BookId as BookId, b.Title as BookName,
                        o.OrderedOn as OrderDate, o.Returned as Returned
                    from Users u LEFT JOIN Orders o ON u.Id=o.UserId
                    LEFT JOIN Books b ON o.BookId=b.Id
                    where o.UserId IN (@Id);
                ";
                orders = connection.Query<Order>(sql, new { Id = userId });
            }
            return orders.ToList();
        }

        /// <summary>
        /// Retrieves a list of all orders, including user and book details.
        /// </summary>
        /// <returns>List of Order objects representing all orders in the library.</returns>
        public IList<Order> GetAllOrders()
        {
            IEnumerable<Order> orders;
            using (var connection = new SqlConnection(DbConnection))
            {
                var sql = @"
                    select 
                        o.Id, 
                        u.Id as UserId, CONCAT(u.FirstName, ' ', u.LastName) as Name,
                        o.BookId as BookId, b.Title as BookName,
                        o.OrderedOn as OrderDate, o.Returned as Returned
                    from Users u LEFT JOIN Orders o ON u.Id=o.UserId
                    LEFT JOIN Books b ON o.BookId=b.Id
                    where o.Id IS NOT NULL;
                ";
                orders = connection.Query<Order>(sql);
            }
            return orders.ToList();
        }

        /// <summary>
        /// Returns a book previously ordered by a specific user.
        /// </summary>
        /// <param name="userId">ID of the user returning the book.</param>
        /// <param name="bookId">ID of the book to be returned.</param>
        /// <returns>True if the book is successfully returned; otherwise, false.</returns>
        public bool ReturnBook(int userId, int bookId)
        {
            var returned = false;
            using (var connection = new SqlConnection(DbConnection))
            {
                var sql = $"update Books set Ordered=0 where Id={bookId};";
                connection.Execute(sql);
                sql = $"update Orders set Returned=1 where UserId={userId} and BookId={bookId};";
                returned = connection.Execute(sql) == 1;
            }
            return returned;
        }

        /// <summary>
        /// Retrieves a list of all users, including fine details based on overdue books.
        /// </summary>
        /// <returns>List of User objects representing all users in the library.</returns>
        public IList<User> GetUsers()
        {
            IEnumerable<User> users;
            using (var connection = new SqlConnection(DbConnection))
            {
                users = connection.Query<User>("select * from Users;");

                var listOfOrders =
                    connection.Query("select u.Id as UserId, o.BookId as BookId, o.OrderedOn as OrderDate, o.Returned as Returned from Users u LEFT JOIN Orders o ON u.Id=o.UserId;");

                // Calculate fines for each user based on overdue books
                foreach (var user in users)
                {
                    var orders = listOfOrders.Where(lo => lo.UserId == user.Id).ToList();
                    var fine = 0;
                    var loanPeriod = 10;
                    var finePerDay = 2;
                    foreach (var order in orders)
                    {
                        if (order.BookId != null && order.Returned != null && order.Returned == false)
                        {
                            var orderDate = order.OrderDate;
                            var maxDate = orderDate.AddDays(loanPeriod);
                            var currentDate = DateTime.Now;

                            var extraDays = (currentDate - maxDate).Days;
                            extraDays = extraDays < 0 ? 0 : extraDays;

                            fine = extraDays * finePerDay;
                            user.Fine += fine;
                        }
                    }
                }
            }
            return users.ToList();
        }

        /// <summary>
        /// Blocks a user, preventing them from placing new orders.
        /// </summary>
        /// <param name="userId">ID of the user to be blocked.</param>
        public void BlockUser(int userId)
        {
            using var connection = new SqlConnection(DbConnection);
            connection.Execute("update Users set Blocked=1 where Id=@Id", new { Id = userId });
        }

        /// <summary>
        /// Unblocks a user, allowing them to place new orders.
        /// </summary>
        /// <param name="userId">ID of the user to be unblocked.</param>
        public void UnblockUser(int userId)
        {
            using var connection = new SqlConnection(DbConnection);
            connection.Execute("update Users set Blocked=0 where Id=@Id", new { Id = userId });
        }

        /// <summary>
        /// Activates a user account, enabling them to log in.
        /// </summary>
        /// <param name="userId">ID of the user to be activated.</param>
        public void ActivateUser(int userId)
        {
            using var connection = new SqlConnection(DbConnection);
            connection.Execute("update Users set Active=1 where Id=@Id", new { Id = userId });
        }

        // <summary>
        /// Deactivates a user account, disabling them from logging in.
        /// </summary>
        /// <param name="userId">ID of the user to be deactivated.</param>
        public void DeactivateUser(int userId)
        {
            using var connection = new SqlConnection(DbConnection);
            connection.Execute("update Users set Active=0 where Id=@Id", new { Id = userId });
        }

        /// <summary>
        /// Retrieves a list of all book categories from the database.
        /// </summary>
        /// <returns>List of BookCategory objects representing all categories.</returns>
        public IList<BookCategory> GetAllCategories()
        {
            IEnumerable<BookCategory> categories;

            using (var connection = new SqlConnection(DbConnection))
            {
                categories = connection.Query<BookCategory>("select * from BookCategories;");
            }

            return categories.ToList();
        }

        /// <summary>
        /// Inserts a new book into the database.
        /// </summary>
        /// <param name="book">Book object containing details of the book to be inserted.</param>
        public void InsertNewBook(Book book)
        {
            using var conn = new SqlConnection(DbConnection);
            var sql = "select Id from BookCategories where Category=@cat and SubCategory=@subcat";
            var parameter1 = new
            {
                cat = book.Category.Category,
                subcat = book.Category.SubCategory
            };
            var categoryId = conn.ExecuteScalar<int>(sql, parameter1);

            sql = "insert into Books (Title, Author, Price, Ordered, CategoryId) values (@title, @author, @price, @ordered, @catid);";
            var parameter2 = new
            {
                title = book.Title,
                author = book.Author,
                price = book.Price,
                ordered = false,
                catid = categoryId
            };
            conn.Execute(sql, parameter2);
        }

        /// <summary>
        /// Deletes a book from the database based on the specified book ID.
        /// </summary>
        /// <param name="bookId">ID of the book to be deleted.</param>
        /// <returns>
        /// True if the book was successfully deleted; otherwise, false. 
        /// Returns true only if exactly one row (book) was affected by the deletion operation.
        /// </returns>
        public bool DeleteBook(int bookId)
        {
            var deleted = false;
            using (var connection = new SqlConnection(DbConnection))
            {
                var sql = $"delete Books where Id={bookId}";
                deleted = connection.Execute(sql) == 1;
            }
            return deleted;
        }

        /// <summary>
        /// Creates a new book category in the database.
        /// </summary>
        /// <param name="bookCategory">BookCategory object containing details of the category to be created.</param>
        public void CreateCategory(BookCategory bookCategory)
        {
            using var connection = new SqlConnection(DbConnection);
            var parameter = new
            {
                cat = bookCategory.Category,
                subcat = bookCategory.SubCategory
            };
            connection.Execute("insert into BookCategories (category, subcategory) values (@cat, @subcat);", parameter);
        }
    }
}
