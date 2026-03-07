import { Product, Category, Banner, News, Newsletter, Customer } from "@/types";

export const categories: Category[] = [
  {
    _id: "1",
    name: "Đất Trồng Rau",
    slug: "dat-trong-rau",
    description: "Đất chuyên dụng cho rau ăn lá và rau củ",
    image: "/categories/rau.jpg",
  },
  {
    _id: "2",
    name: "Đất Trồng Hoa",
    slug: "dat-trong-hoa",
    description: "Đất dinh dưỡng cho hoa cảnh và hoa kiểng",
    image: "/categories/hoa.jpg",
  },
  {
    _id: "3",
    name: "Đất Ươm Cây",
    slug: "dat-uom-cay",
    description: "Đất ươm hạt giống và cây non",
    image: "/categories/uom.jpg",
  },
  {
    _id: "4",
    name: "Phân Bón Hữu Cơ",
    slug: "phan-bon-huu-co",
    description: "Phân bón từ thiên nhiên",
    image: "/categories/phan.jpg",
  },
];

export const products: Product[] = [
  {
    _id: "p1",
    name: "Đất Sạch Tam Nông - Bao 50L",
    description: "Đất sạch dinh dưỡng cao cấp, sử dụng trực tiếp cho mọi loại cây trồng. Tơi xốp, thoát nước tốt, giàu hữu cơ.",
    price: 120000,
    originalPrice: 150000,
    stock: 500,
    category: categories[0],
    images: [
      "/product.jpg",
      "/product.jpg",
      "/product.jpg",
    ],
    rating: 4.8,
    reviewCount: 127,
    isActive: true,
    specifications: {
      weight: "50L",
      volume: "~30kg",
      origin: "Vĩnh Long",
      ph: "5.5 - 6.5",
      organic: ">40%",
    },
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    _id: "p2",
    name: "Đất Sạch Tam Nông - Bao 20L",
    description: "Đất sạch dinh dưỡng phù hợp cho chậu cảnh nhỏ và vườn ban công.",
    price: 50000,
    originalPrice: 60000,
    stock: 800,
    category: categories[0],
    images: ["/product.jpg"],
    rating: 4.7,
    reviewCount: 89,
    isActive: true,
    specifications: {
      weight: "20L",
      volume: "~12kg",
      origin: "Vĩnh Long",
      ph: "5.5 - 6.5",
    },
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    _id: "p3",
    name: "Đất Trồng Hoa Cao Cấp - 30L",
    description: "Đất chuyên dụng cho hoa hồng, hoa lan, hoa cảnh. Bổ sung dinh dưỡng đầy đủ.",
    price: 85000,
    stock: 350,
    category: categories[1],
    images: ["/product.jpg"],
    rating: 4.9,
    reviewCount: 64,
    isActive: true,
    specifications: {
      weight: "30L",
      volume: "~18kg",
      origin: "Vĩnh Long",
    },
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    _id: "p4",
    name: "Đất Ươm Hạt - 10L",
    description: "Đất mịn, nhẹ, giúp hạt nảy mầm nhanh. Phù hợp ươm rau, ươm cây giống.",
    price: 35000,
    stock: 600,
    category: categories[2],
    images: ["/product.jpg"],
    rating: 4.6,
    reviewCount: 42,
    isActive: true,
    specifications: {
      weight: "10L",
      volume: "~6kg",
      origin: "Vĩnh Long",
    },
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  {
    _id: "p5",
    name: "Phân Hữu Cơ Tam Nông - 5kg",
    description: "Phân bón hữu cơ từ phế phẩm nông nghiệp, giàu dinh dưỡng, an toàn.",
    price: 45000,
    stock: 400,
    category: categories[3],
    images: ["/product.jpg"],
    rating: 4.7,
    reviewCount: 55,
    isActive: true,
    specifications: {
      weight: "5kg",
      type: "Hữu cơ",
      origin: "Vĩnh Long",
    },
    createdAt: "2024-02-05T00:00:00Z",
    updatedAt: "2024-02-05T00:00:00Z",
  },
  {
    _id: "p6",
    name: "Combo Đất Trồng Rau - 100L",
    description: "Combo 2 bao đất 50L, tiết kiệm và tiện lợi cho vườn rau gia đình.",
    price: 220000,
    originalPrice: 240000,
    stock: 200,
    category: categories[0],
    images: ["/product.jpg"],
    rating: 4.9,
    reviewCount: 33,
    isActive: true,
    specifications: {
      weight: "100L (2 bao x 50L)",
      volume: "~60kg",
      origin: "Vĩnh Long",
    },
    createdAt: "2024-02-10T00:00:00Z",
    updatedAt: "2024-02-10T00:00:00Z",
  },
];

export const banners: Banner[] = [
  {
    _id: "b1",
    type: "hero",
    title: "Đất Sạch Tam Nông",
    description: "Nông nghiệp - Nông dân - Nông thôn",
    imageUrl: "/banner1.png",
    linkUrl: "/products",
    buttonText: "Mua ngay",
    position: 1,
    isActive: true,
  },
  {
    _id: "b2",
    type: "hero",
    title: "Giảm giá 20% - Mừng khai trương",
    description: "Áp dụng cho đơn hàng từ 500.000đ",
    imageUrl: "/banner2.png",
    linkUrl: "/products",
    buttonText: "Xem ngay",
    position: 2,
    isActive: true,
  },
  {
    _id: "b3",
    type: "hero",
    title: "Miễn phí vận chuyển",
    description: "Cho đơn hàng trên 500.000đ",
    imageUrl: "/banner3.png",
    linkUrl: "/products",
    buttonText: "Khám phá",
    position: 3,
    isActive: true,
  },
];

export const newsArticles: News[] = [
  {
    _id: "n1",
    title: "Bí quyết chọn đất sạch chất lượng cho vườn rau gia đình",
    slug: "bi-quyet-chon-dat-sach-chat-luong",
    excerpt: "Việc lựa chọn đất trồng phù hợp là yếu tố quan trọng quyết định đến sự phát triển của cây trồng. Cùng tìm hiểu những tiêu chí để chọn được loại đất sạch tốt nhất.",
    content: `
      <h2>Tầm quan trọng của đất trồng chất lượng</h2>
      <p>Đất trồng là nền tảng cung cấp dinh dưỡng, nước và không khí cho cây. Một loại đất tốt cần đảm bảo các yếu tố: tơi xốp, thoát nước tốt, giàu dinh dưỡng và có độ pH phù hợp.</p>
      
      <h2>5 tiêu chí chọn đất sạch chất lượng</h2>
      <h3>1. Nguồn gốc rõ ràng</h3>
      <p>Ưu tiên chọn đất có nguồn gốc xuất xứ rõ ràng, được sản xuất bởi các đơn vị uy tín. Nên tìm hiểu về quy trình sản xuất và thành phần của đất.</p>
      
      <h3>2. Thành phần hữu cơ cao</h3>
      <p>Đất hữu cơ chứa nhiều chất dinh dưỡng tự nhiên, giúp cây phát triển khỏe mạnh. Hàm lượng hữu cơ tối thiểu nên từ 30-40%.</p>
      
      <h3>3. Độ tơi xốp và thoát nước</h3>
      <p>Đất tốt cần có cấu trúc tơi xốp, không bị đóng vón, giúp rễ cây dễ phát triển và thoát nước tốt để tránh úng rễ.</p>
      
      <h3>4. Độ pH cân bằng</h3>
      <p>Hầu hết cây trồng phát triển tốt ở độ pH từ 5.5-6.5. Nên kiểm tra độ pH trước khi sử dụng.</p>
      
      <h3>5. Không chứa hóa chất độc hại</h3>
      <p>Đất sạch phải đảm bảo không chứa kim loại nặng, hóa chất độc hại, an toàn cho người sử dụng và môi trường.</p>
      
      <h2>Kết luận</h2>
      <p>Đất Sạch Tam Nông cam kết cung cấp sản phẩm đạt tất cả các tiêu chí trên, giúp bạn yên tâm trồng trọt và thu hoạch rau sạch cho gia đình.</p>
    `,
    image: "/product.jpg",
    category: "Kiến thức trồng trọt",
    author: "Nguyễn Văn A",
    isActive: true,
    createdAt: "2024-02-20T00:00:00Z",
    updatedAt: "2024-02-20T00:00:00Z",
  },
  {
    _id: "n2",
    title: "Hướng dẫn trồng rau sạch tại nhà cho người mới bắt đầu",
    slug: "huong-dan-trong-rau-sach-tai-nha",
    excerpt: "Trồng rau sạch tại nhà không khó như bạn nghĩ. Với một chút kiến thức cơ bản và sự chăm chỉ, bạn hoàn toàn có thể có được vườn rau xanh tươi ngay tại nhà.",
    content: `
      <h2>Chuẩn bị trước khi trồng</h2>
      <p>Trước khi bắt tay vào trồng rau, bạn cần chuẩn bị các yếu tố sau:</p>
      
      <h3>Chọn vị trí trồng</h3>
      <p>Rau cần ánh sáng mặt trời ít nhất 4-6 giờ mỗi ngày. Nếu trồng trong nhà, chọn vị trí gần cửa sổ hoặc ban công hướng Đông hoặc Tây.</p>
      
      <h3>Lựa chọn giống rau</h3>
      <p>Người mới bắt đầu nên chọn các loại rau dễ trồng như: rau muống, rau cải, húng quế, rau thơm. Những loại này ít sâu bệnh và phát triển nhanh.</p>
      
      <h3>Chuẩn bị đất trồng</h3>
      <p>Sử dụng đất sạch chất lượng cao như Đất Sạch Tam Nông, đảm bảo tơi xốp và giàu dinh dưỡng. Không nên dùng đất từ vườn hoang vì có thể chứa sâu bệnh.</p>
      
      <h2>Quy trình trồng rau cơ bản</h2>
      <ol>
        <li>Chuẩn bị chậu/khay trồng có lỗ thoát nước</li>
        <li>Cho đất vào chậu, để cách mép chậu 2-3cm</li>
        <li>Gieo hạt hoặc cắm giống, phủ một lớp đất mỏng</li>
        <li>Tưới nước đều, giữ ẩm cho đất</li>
        <li>Chăm sóc thường xuyên: tưới nước, bón phân, diệt sâu</li>
      </ol>
      
      <h2>Chăm sóc rau hàng ngày</h2>
      <p>Tưới nước 1-2 lần/ngày vào sáng sớm hoặc chiều mát. Kiểm tra sâu bệnh thường xuyên. Bón phân hữu cơ 1-2 tuần/lần.</p>
      
      <p>Chúc bạn thành công với vườn rau sạch của mình!</p>
    `,
    image: "/product.jpg",
    category: "Hướng dẫn",
    author: "Trần Thị B",
    isActive: true,
    createdAt: "2024-02-25T00:00:00Z",
    updatedAt: "2024-02-25T00:00:00Z",
  },
  {
    _id: "n3",
    title: "Lợi ích của việc sử dụng đất hữu cơ trong trồng trọt",
    slug: "loi-ich-dat-huu-co-trong-trong-trot",
    excerpt: "Đất hữu cơ không chỉ tốt cho cây trồng mà còn góp phần bảo vệ môi trường và sức khỏe con người. Cùng tìm hiểu những lợi ích tuyệt vời này.",
    content: `
      <h2>Đất hữu cơ là gì?</h2>
      <p>Đất hữu cơ là loại đất được làm từ các nguyên liệu tự nhiên như phân chuồng, xơ dừa, mùn cưa, phế phẩm nông nghiệp... qua quá trình ủ hoai mục. Không sử dụng hóa chất tổng hợp.</p>
      
      <h2>10 lợi ích vượt trội của đất hữu cơ</h2>
      
      <h3>1. An toàn cho sức khỏe</h3>
      <p>Không chứa hóa chất độc hại, kim loại nặng. Rau củ trồng bằng đất hữu cơ an toàn tuyệt đối cho người tiêu dùng.</p>
      
      <h3>2. Cải thiện cấu trúc đất</h3>
      <p>Đất hữu cơ giúp đất tơi xốp, tăng khả năng giữ nước và thoát nước tốt hơn.</p>
      
      <h3>3. Giàu dinh dưỡng tự nhiên</h3>
      <p>Cung cấp đầy đủ các chất dinh dưỡng cần thiết cho cây trong thời gian dài.</p>
      
      <h3>4. Tăng sức đề kháng cho cây</h3>
      <p>Cây trồng khỏe mạnh hơn, ít bị sâu bệnh tấn công.</p>
      
      <h3>5. Thân thiện môi trường</h3>
      <p>Giảm ô nhiễm đất, nước, không gây hại cho hệ sinh thái.</p>
      
      <h3>6. Tiết kiệm chi phí</h3>
      <p>Dù giá ban đầu cao hơn nhưng hiệu quả lâu dài, không cần bón nhiều phân.</p>
      
      <h3>7. Cải thiện chất lượng nông sản</h3>
      <p>Rau củ ngon ngọt tự nhiên, giá trị dinh dưỡng cao hơn.</p>
      
      <h3>8. Dễ sử dụng</h3>
      <p>Đất Sạch Tam Nông sử dụng trực tiếp, không cần ủ, tiện lợi cho người dùng.</p>
      
      <h3>9. Phù hợp nhiều loại cây</h3>
      <p>Có thể dùng cho rau, hoa, cây cảnh, cây ăn quả...</p>
      
      <h3>10. Góp phần phát triển bền vững</h3>
      <p>Hỗ trợ nền nông nghiệp xanh, bảo vệ môi trường cho thế hệ sau.</p>
      
      <h2>Kết luận</h2>
      <p>Sử dụng đất hữu cơ là xu hướng tất yếu cho nền nông nghiệp hiện đại. Hãy lựa chọn Đất Sạch Tam Nông để có được những sản phẩm chất lượng nhất!</p>
    `,
    image: "/product.jpg",
    category: "Kiến thức nông nghiệp",
    author: "Lê Văn C",
    isActive: true,
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
  },
  {
    _id: "n4",
    title: "Cách phân biệt đất sạch và đất thường",
    slug: "cach-phan-biet-dat-sach-va-dat-thuong",
    excerpt: "Làm sao để biết đất bạn mua có thực sự sạch và chất lượng? Cùng học cách phân biệt đất sạch và đất thường qua các dấu hiệu đơn giản.",
    content: `
      <h2>Tại sao cần phân biệt?</h2>
      <p>Trên thị trường hiện nay có rất nhiều loại đất với giá cả và chất lượng khác nhau. Việc biết phân biệt giúp bạn tránh mua phải hàng kém chất lượng.</p>
      
      <h2>Các dấu hiệu nhận biết đất sạch</h2>
      
      <h3>Quan sát bằng mắt</h3>
      <ul>
        <li>Đất sạch có màu đen nâu tự nhiên, không quá đen hoặc quá nâu nhạt</li>
        <li>Cấu trúc tơi xốp, không bị vón cục</li>
        <li>Có thể thấy các thành phần hữu cơ như mùn cưa, xơ dừa...</li>
      </ul>
      
      <h3>Sờ vào tay</h3>
      <ul>
        <li>Đất sạch mềm mại, tơi xốp khi sờ vào</li>
        <li>Không bị dính tay quá mức</li>
        <li>Khi bóp chặt, đất tan ra dễ dàng</li>
      </ul>
      
      <h3>Ngửi mùi</h3>
      <ul>
        <li>Đất sạch có mùi hương đất tự nhiên, mùi mùn</li>
        <li>Không có mùi hôi, mùi hóa chất</li>
      </ul>
      
      <h3>Thử nghiệm đơn giản</h3>
      <ul>
        <li>Cho đất vào nước: đất tốt sẽ lắng xuống, nước trong</li>
        <li>Đất kém chất lượng sẽ làm nước đục lâu</li>
      </ul>
      
      <h2>So sánh đất sạch và đất thường</h2>
      <table>
        <tr>
          <th>Tiêu chí</th>
          <th>Đất sạch</th>
          <th>Đất thường</th>
        </tr>
        <tr>
          <td>Nguồn gốc</td>
          <td>Rõ ràng, có giấy tờ</td>
          <td>Không rõ nguồn gốc</td>
        </tr>
        <tr>
          <td>Thành phần</td>
          <td>100% hữu cơ</td>
          <td>Có thể có hóa chất</td>
        </tr>
        <tr>
          <td>Giá thành</td>
          <td>Cao hơn</td>
          <td>Rẻ hơn</td>
        </tr>
        <tr>
          <td>Hiệu quả</td>
          <td>Lâu dài, bền vững</td>
          <td>Ngắn hạn</td>
        </tr>
      </table>
      
      <p>Đất Sạch Tam Nông cam kết cung cấp sản phẩm đạt chuẩn chất lượng cao nhất!</p>
    `,
    image: "/product.jpg",
    category: "Kiến thức",
    author: "Phạm Thị D",
    isActive: true,
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z",
  },
  {
    _id: "n5",
    title: "Xu hướng nông nghiệp đô thị và vai trò của đất sạch",
    slug: "xu-huong-nong-nghiep-do-thi",
    excerpt: "Nông nghiệp đô thị đang trở thành xu hướng toàn cầu. Tìm hiểu về phong trào này và tầm quan trọng của đất sạch trong việc phát triển nông nghiệp xanh tại các thành phố.",
    content: `
      <h2>Nông nghiệp đô thị là gì?</h2>
      <p>Nông nghiệp đô thị là hình thức canh tác nông nghiệp trong khu vực đô thị, bao gồm trồng rau, hoa, cây ăn quả trên sân thượng, ban công, vườn nhà...</p>
      
      <h2>Lý do xu hướng này phát triển</h2>
      <ul>
        <li>Người dân quan tâm nhiều hơn đến an toàn thực phẩm</li>
        <li>Mong muốn có nguồn rau sạch cho gia đình</li>
        <li>Tận dụng không gian sống hiệu quả</li>
        <li>Giảm stress, gần gũi thiên nhiên</li>
      </ul>
      
      <h2>Vai trò của đất sạch</h2>
      <p>Trong không gian hạn chế của đô thị, việc sử dụng đất chất lượng cao càng trở nên quan trọng. Đất sạch giúp:</p>
      <ul>
        <li>Tối ưu hóa dinh dưỡng trong không gian nhỏ</li>
        <li>An toàn cho môi trường sống</li>
        <li>Dễ sử dụng, phù hợp với người bận rộn</li>
        <li>Mang lại hiệu quả cao</li>
      </ul>
      
      <p>Đất Sạch Tam Nông là lựa chọn hoàn hảo cho nông nghiệp đô thị!</p>
    `,
    image: "/product.jpg",
    category: "Xu hướng",
    author: "Nguyễn Văn E",
    isActive: true,
    createdAt: "2024-02-10T00:00:00Z",
    updatedAt: "2024-02-10T00:00:00Z",
  },
];

export const newsletters: Newsletter[] = [
  {
    _id: "nl1",
    email: "nguyenvana@gmail.com",
    subscribedAt: "2024-03-01T08:30:00Z",
    status: "active",
    ipAddress: "192.168.1.100",
    source: "footer-form",
  },
  {
    _id: "nl2",
    email: "tranthib@gmail.com",
    subscribedAt: "2024-03-02T14:20:00Z",
    status: "active",
    ipAddress: "192.168.1.101",
    source: "footer-form",
  },
  {
    _id: "nl3",
    email: "levanc@yahoo.com",
    subscribedAt: "2024-03-02T16:45:00Z",
    status: "active",
    ipAddress: "192.168.1.102",
    source: "footer-form",
  },
  {
    _id: "nl4",
    email: "phamthid@hotmail.com",
    subscribedAt: "2024-03-03T09:15:00Z",
    status: "unsubscribed",
    ipAddress: "192.168.1.103",
    source: "footer-form",
  },
  {
    _id: "nl5",
    email: "hoangvane@gmail.com",
    subscribedAt: "2024-03-03T11:00:00Z",
    status: "active",
    ipAddress: "192.168.1.104",
    source: "checkout",
  },
  {
    _id: "nl6",
    email: "vuthif@gmail.com",
    subscribedAt: "2024-03-03T15:30:00Z",
    status: "active",
    ipAddress: "192.168.1.105",
    source: "footer-form",
  },
  {
    _id: "nl7",
    email: "dangvang@outlook.com",
    subscribedAt: "2024-03-04T08:00:00Z",
    status: "active",
    ipAddress: "192.168.1.106",
    source: "footer-form",
  },
  {
    _id: "nl8",
    email: "buithih@gmail.com",
    subscribedAt: "2024-03-04T10:20:00Z",
    status: "active",
    ipAddress: "192.168.1.107",
    source: "footer-form",
  },
];

export const customers: Customer[] = [
  // Từ tuần trước (26 Feb - 3 Mar)
  {
    _id: "c1",
    name: "Vãng lai",
    email: "nguyenvana@gmail.com",
    phone: "",
    createdAt: "2026-02-26T08:30:00Z",
    status: "active",
    ipAddress: "192.168.1.100",
    source: "footer",
  },
  {
    _id: "c2",
    name: "Vãng lai",
    email: "tranthib@gmail.com",
    phone: "",
    createdAt: "2026-02-27T14:20:00Z",
    status: "active",
    ipAddress: "192.168.1.101",
    source: "footer",
  },
  {
    _id: "c3",
    name: "Nguyễn Văn B",
    email: "nguyenvanb@gmail.com",
    phone: "0912345678",
    createdAt: "2026-02-28T10:15:00Z",
    status: "active",
    ipAddress: "192.168.1.102",
    source: "manual",
    note: "Khách hàng VIP, quan tâm đến đất trồng hoa hồng",
  },
  {
    _id: "c4",
    name: "Vãng lai",
    email: "levanc@yahoo.com",
    phone: "",
    createdAt: "2026-03-01T16:45:00Z",
    status: "active",
    ipAddress: "192.168.1.103",
    source: "footer",
  },
  {
    _id: "c5",
    name: "Trần Thị C",
    email: "tranthic@gmail.com",
    phone: "0987654321",
    createdAt: "2026-03-02T09:00:00Z",
    status: "unsubscribed",
    ipAddress: "192.168.1.104",
    source: "manual",
    note: "Đã hủy đăng ký vì nhận quá nhiều email",
  },
  // Từ tuần này (4 Mar -)
  {
    _id: "c6",
    name: "Vãng lai",
    email: "phamthid@hotmail.com",
    phone: "",
    createdAt: "2026-03-04T09:15:00Z",
    status: "active",
    ipAddress: "192.168.1.105",
    source: "checkout",
  },
  {
    _id: "c7",
    name: "Vãng lai",
    email: "hoangvane@gmail.com",
    phone: "",
    createdAt: "2026-03-04T11:00:00Z",
    status: "active",
    ipAddress: "192.168.1.106",
    source: "footer",
  },
  {
    _id: "c8",
    name: "Vãng lai",
    email: "vuthif@gmail.com",
    phone: "",
    createdAt: "2026-03-04T15:30:00Z",
    status: "active",
    ipAddress: "192.168.1.107",
    source: "footer",
  },
  {
    _id: "c9",
    name: "Lê Văn D",
    email: "levand@outlook.com",
    phone: "0901234567",
    createdAt: "2026-03-04T16:20:00Z",
    status: "active",
    ipAddress: "192.168.1.108",
    source: "manual",
    note: "Chủ trang trại, mua số lượng lớn",
  },
  {
    _id: "c10",
    name: "Vãng lai",
    email: "dangvang@outlook.com",
    phone: "",
    createdAt: "2026-03-04T17:00:00Z",
    status: "active",
    ipAddress: "192.168.1.109",
    source: "footer",
  },
];
