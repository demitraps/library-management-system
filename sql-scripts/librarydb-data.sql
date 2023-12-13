USE [Library]
GO

SET IDENTITY_INSERT [dbo].[BookCategories] ON 

INSERT [dbo].[BookCategories] ([Id], [Category], [SubCategory]) VALUES (1, N'Classic', N'Fiction')
INSERT [dbo].[BookCategories] ([Id], [Category], [SubCategory]) VALUES (2, N'Contemporary', N'Fiction')
INSERT [dbo].[BookCategories] ([Id], [Category], [SubCategory]) VALUES (3, N'Contemporary', N'Mystery')
INSERT [dbo].[BookCategories] ([Id], [Category], [SubCategory]) VALUES (4, N'Contemporary', N'Memoir')
INSERT [dbo].[BookCategories] ([Id], [Category], [SubCategory]) VALUES (5, N'Contemporary', N'Thriller')
INSERT [dbo].[BookCategories] ([Id], [Category], [SubCategory]) VALUES (6, N'Contemporary', N'Children')
INSERT [dbo].[BookCategories] ([Id], [Category], [SubCategory]) VALUES (7, N'Contemporary', N'Dystopian')
INSERT [dbo].[BookCategories] ([Id], [Category], [SubCategory]) VALUES (8, N'Classic', N'Poetry')
SET IDENTITY_INSERT [dbo].[BookCategories] OFF
GO
SET IDENTITY_INSERT [dbo].[Books] ON 

INSERT [dbo].[Books] ([Id], [Title], [Author], [Price], [Ordered], [CategoryId]) VALUES (1, N'The Tale of Genji', N'Murasaki Shikibu', 2, 1, 1)
INSERT [dbo].[Books] ([Id], [Title], [Author], [Price], [Ordered], [CategoryId]) VALUES (2, N'I am a Cat', N'Soseki Natsume', 1, 0, 1)
INSERT [dbo].[Books] ([Id], [Title], [Author], [Price], [Ordered], [CategoryId]) VALUES (3, N'The Woman In the Purple Skirt', N'Natsuko Imamura', 3, 1, 2)
INSERT [dbo].[Books] ([Id], [Title], [Author], [Price], [Ordered], [CategoryId]) VALUES (4, N'The Devotion of Suspect X', N'Keigo Higashino', 4, 0, 3)
INSERT [dbo].[Books] ([Id], [Title], [Author], [Price], [Ordered], [CategoryId]) VALUES (5, N'The reason I jump', N'Naoki Higashida', 2, 0, 4)
INSERT [dbo].[Books] ([Id], [Title], [Author], [Price], [Ordered], [CategoryId]) VALUES (6, N'Snow Country', N'Yasunari Kawabata', 2, 0, 1)
INSERT [dbo].[Books] ([Id], [Title], [Author], [Price], [Ordered], [CategoryId]) VALUES (7, N'The Silent Cry', N'Kenzaburo Oe', 4, 0, 2)
INSERT [dbo].[Books] ([Id], [Title], [Author], [Price], [Ordered], [CategoryId]) VALUES (8, N'The Thief', N'Fuminori Nakamura', 3, 0, 5)
INSERT [dbo].[Books] ([Id], [Title], [Author], [Price], [Ordered], [CategoryId]) VALUES (9, N'Lonely Castle in the Mirror', N'Mizuki Tsujimura', 4, 3, 2)
INSERT [dbo].[Books] ([Id], [Title], [Author], [Price], [Ordered], [CategoryId]) VALUES (10, N'Kokoro', N'Natsume Soseki', 2, 2, 1)
INSERT [dbo].[Books] ([Id], [Title], [Author], [Price], [Ordered], [CategoryId]) VALUES (11, N'How do you Live?', N'Genzaburo Yoshino', 4, 2, 6)
INSERT [dbo].[Books] ([Id], [Title], [Author], [Price], [Ordered], [CategoryId]) VALUES (12, N'Tokyo Express', N'Seicho Machumoto', 2, 0, 2)
INSERT [dbo].[Books] ([Id], [Title], [Author], [Price], [Ordered], [CategoryId]) VALUES (13, N'Earthlings', N'Sayaka Murata', 3, 1, 2)
INSERT [dbo].[Books] ([Id], [Title], [Author], [Price], [Ordered], [CategoryId]) VALUES (14, N'No Longer Human', N'Osamu Dazai', 2, 2, 1)
INSERT [dbo].[Books] ([Id], [Title], [Author], [Price], [Ordered], [CategoryId]) VALUES (15, N'Breast and Eggs', N'Mieko Kawakami', 4, 1, 2)
INSERT [dbo].[Books] ([Id], [Title], [Author], [Price], [Ordered], [CategoryId]) VALUES (16, N'Last Children of Tokyo', N'Yoko Tawada', 4, 0, 7)
INSERT [dbo].[Books] ([Id], [Title], [Author], [Price], [Ordered], [CategoryId]) VALUES (17, N'The Narrow Road To the Deep North', N'Matsuo Basho', 2, 0, 8)
INSERT [dbo].[Books] ([Id], [Title], [Author], [Price], [Ordered], [CategoryId]) VALUES (18, N'The Sailor Who Fell From Grace with the Sea', N'Yukio Mishima', 1, 0, 1)
INSERT [dbo].[Books] ([Id], [Title], [Author], [Price], [Ordered], [CategoryId]) VALUES (19, N'The Makioka Sisters', N'Junichiro Tanizaki', 4, 2, 1)
INSERT [dbo].[Books] ([Id], [Title], [Author], [Price], [Ordered], [CategoryId]) VALUES (20, N'The Wind-Up Bird Chronicle', N'Haruki Murakami', 3, 0, 2)

SET IDENTITY_INSERT [dbo].[Books] OFF
GO
