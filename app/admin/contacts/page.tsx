"use client";

import { useState, useEffect } from "react";
import { Search, MessageSquare, Mail, Phone, User, Calendar, CheckCircle, Copy, Check, X, Trash2 } from "lucide-react";
import * as contactService from "@/services/contactService";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status: "new" | "read" | "replied";
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [logoBase64, setLogoBase64] = useState<string>("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  // Convert logo to base64 on component mount
  useEffect(() => {
    const convertLogoToBase64 = async () => {
      try {
        const response = await fetch('/logo.jpg');
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoBase64(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Failed to convert logo to base64:', error);
      }
    };
    convertLogoToBase64();
  }, []);

  // Fetch contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await contactService.getContacts();
        setContacts(response.data || []);
      } catch (err: any) {
        console.error('Failed to fetch contacts:', err);
        setError(err.response?.data?.message || 'Không thể tải danh sách liên hệ');
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm);
    const matchesStatus = selectedStatus === "all" || contact.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (id: string, newStatus: Contact["status"]) => {
    try {
      await contactService.updateContactStatus(id, newStatus);
      // Update local state
      setContacts(contacts.map(contact => 
        contact._id === id ? { ...contact, status: newStatus } : contact
      ));
    } catch (err: any) {
      console.error('Failed to update contact status:', err);
      alert('Không thể cập nhật trạng thái');
    }
  };

  const getEmailHTML = (contact: Contact) => {
    // Use base64 encoded logo for email compatibility
    const logoSrc = logoBase64 || '/logo.jpg'; // Fallback to URL if base64 not ready
    
    return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <!-- Header with Logo -->
  <div style="background-color: #39b54a; padding: 30px; text-align: center;">
    <div style="background-color: white; display: inline-block; padding: 20px 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <img src="${logoSrc}" alt="Logo" style="height: 80px; width: auto; display: block; margin: 0 auto 10px;" />
      <h1 style="margin: 0; color: #39b54a; font-size: 24px; font-weight: bold; letter-spacing: 1px;">
        ĐẤT SẠCH TAM NÔNG
      </h1>
      <p style="margin: 8px 0 0 0; color: #666; font-size: 12px; font-style: italic;">Nông nghiệp - Nông dân - Nông thôn</p>
    </div>
  </div>

  <!-- Main Content -->
  <div style="padding: 30px; background-color: #f9f9f9;">
    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
      Kính gửi <strong>${contact.name}</strong>,
    </p>
    
    <p style="font-size: 14px; line-height: 1.8; margin-bottom: 20px;">
      Cảm ơn bạn đã liên hệ với <strong>Đất Sạch Tam Nông</strong>. Chúng tôi đã nhận được phản hồi của bạn về:
    </p>
    
    <div style="background-color: white; border-left: 4px solid #39b54a; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
      <p style="font-style: italic; color: #666; margin: 0; line-height: 1.6;">
        "${contact.message}"
      </p>
    </div>
    
    <p style="font-size: 14px; line-height: 1.8; margin-bottom: 20px;">
      [Nội dung trả lời của bạn ở đây]
    </p>
    
    <p style="font-size: 14px; line-height: 1.8; margin-bottom: 10px;">
      Trân trọng,
    </p>
    <p style="font-size: 14px; font-weight: bold; margin: 0;">
      Đội ngũ Đất Sạch Tam Nông
    </p>
  </div>

  <!-- Footer -->
  <div style="background-color: #2d4a2c; color: white; padding: 25px; text-align: center;">
    <div style="margin-bottom: 15px;">
      <span style="margin: 0 10px;">📧 support@datsachtamnong.com</span>
      <span style="margin: 0 10px;">📞 0867.68.68.69</span>
    </div>
    <p style="font-size: 12px; margin: 5px 0; opacity: 0.8;">
      Nhà máy sản xuất: Ấp An Nhơn 2, xã Mỏ Cày, tỉnh Vĩnh Long
    </p>
    <p style="font-size: 12px; margin: 10px 0 0 0; opacity: 0.6;">
      © 2026 Đất Sạch Tam Nông. All rights reserved.
    </p>
  </div>
</div>`;
  };

  const copyEmailHTML = async () => {
    if (!selectedContact) return;
    
    try {
      const htmlContent = getEmailHTML(selectedContact);
      
      // Copy as HTML with formatting (for Gmail/Email clients)
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({
        'text/html': blob,
        'text/plain': new Blob([htmlContent], { type: 'text/plain' })
      });
      
      await navigator.clipboard.write([clipboardItem]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback to plain text copy
      try {
        await navigator.clipboard.writeText(getEmailHTML(selectedContact));
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy also failed:', fallbackErr);
      }
    }
  };

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return;
    
    try {
      await contactService.deleteContact(contactToDelete._id);
      // Remove from local state
      setContacts(contacts.filter(c => c._id !== contactToDelete._id));
      // Clear selection if deleted contact was selected
      if (selectedContact?._id === contactToDelete._id) {
        setSelectedContact(null);
      }
      setShowDeleteConfirm(false);
      setContactToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete contact:', err);
      alert('Không thể xóa liên hệ. Vui lòng thử lại.');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý liên hệ & góp ý</h1>
        <p className="text-gray-600">
          Tổng {contacts.length} liên hệ • {contacts.filter(c => c.status === "new").length} mới
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#39b54a] border-r-transparent mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900 placeholder:text-gray-500"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a] text-gray-900"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="new">Mới</option>
            <option value="read">Đã đọc</option>
            <option value="replied">Đã trả lời</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <div
                  key={contact._id}
                  onClick={() => {
                    setSelectedContact(contact);
                    if (contact.status === "new") {
                      updateStatus(contact._id, "read");
                    }
                  }}
                  className={`p-6 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedContact?._id === contact._id ? "bg-blue-50" : ""
                  } ${contact.status === "new" ? "border-l-4 border-[#39b54a]" : ""}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{contact.name}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail size={14} />
                            {contact.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={14} />
                            {contact.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {contact.status === "new" && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          Mới
                        </span>
                      )}
                      {contact.status === "read" && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          Đã đọc
                        </span>
                      )}
                      {contact.status === "replied" && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Đã trả lời
                        </span>
                      )}
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        <span suppressHydrationWarning>
                          {new Date(contact.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{contact.message}</p>
                </div>
              ))}

              {/* Empty State */}
              {filteredContacts.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg mb-2">Không tìm thấy liên hệ</p>
                  <p className="text-gray-400 text-sm">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Detail */}
        <div className="lg:col-span-1">
          {selectedContact ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Chi tiết liên hệ</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Người gửi</label>
                  <p className="text-gray-900">{selectedContact.name}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Email</label>
                  <p className="text-gray-900">{selectedContact.email}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Số điện thoại</label>
                  <p className="text-gray-900">{selectedContact.phone}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Thời gian</label>
                  <p className="text-gray-900" suppressHydrationWarning>
                    {new Date(selectedContact.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Nội dung</label>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedContact.message}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Cập nhật trạng thái</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(selectedContact._id, "read")}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedContact.status === "read"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Đã đọc
                    </button>
                    <button
                      onClick={() => updateStatus(selectedContact._id, "replied")}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedContact.status === "replied"
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Đã trả lời
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="w-full bg-[#39b54a] text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#2d8f3a] transition-colors"
                  >
                    <Mail size={18} />
                    Trả lời Email
                  </button>
                  
                  <button
                    onClick={() => handleDeleteClick(selectedContact)}
                    className="w-full bg-red-500 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                    Xóa liên hệ
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Chọn một liên hệ để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-1">Tổng liên hệ</p>
            <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-1">Mới</p>
            <p className="text-2xl font-bold text-red-600">{contacts.filter(c => c.status === "new").length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-1">Đã đọc</p>
            <p className="text-2xl font-bold text-blue-600">{contacts.filter(c => c.status === "read").length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-1">Đã trả lời</p>
            <p className="text-2xl font-bold text-green-600">{contacts.filter(c => c.status === "replied").length}</p>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && contactToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Xác nhận xóa</h2>
                <p className="text-sm text-gray-600">Hành động này không thể hoàn tác</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Bạn có chắc chắn muốn xóa liên hệ từ <strong>{contactToDelete.name}</strong>?
              </p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {contactToDelete.email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Số điện thoại:</strong> {contactToDelete.phone}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  <strong>Nội dung:</strong> {contactToDelete.message}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setContactToDelete(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Xóa liên hệ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {showEmailModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Preview Email Template</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Gửi đến: {selectedContact.email}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setIsCopied(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Email Preview */}
              <div className="bg-gray-100 p-8 rounded-lg mb-6">
                <div 
                  dangerouslySetInnerHTML={{ __html: getEmailHTML(selectedContact) }}
                  className="bg-white"
                />
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Mail size={18} />
                  Hướng dẫn sử dụng
                </h3>
                <ol className="text-sm text-blue-800 space-y-1.5 ml-5 list-decimal">
                  <li>Click nút "<strong>Copy HTML</strong>" bên dưới</li>
                  <li>Mở <strong>Gmail</strong> và tạo email mới đến: <strong>{selectedContact.email}</strong></li>
                  <li>Click vào vùng soạn thảo email (body)</li>
                  <li>Nhấn <strong>Ctrl+V</strong> (Windows) hoặc <strong>Cmd+V</strong> (Mac) để paste</li>
                  <li>Email sẽ hiển thị với <strong>đầy đủ định dạng và logo</strong></li>
                  <li>Chỉnh sửa nội dung tại phần <strong>[Nội dung trả lời của bạn ở đây]</strong></li>
                  <li>Gửi email</li>
                </ol>
                <p className="text-xs text-blue-700 mt-3 italic">
                  💡 Lưu ý: Nếu paste ra text thuần, hãy đảm bảo Gmail đang ở chế độ Rich Text (không phải Plain Text)
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t p-6 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    copyEmailHTML();
                    updateStatus(selectedContact._id, "replied");
                  }}
                  disabled={!logoBase64}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                    !logoBase64
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#39b54a] text-white hover:bg-[#2d8f3a]'
                  }`}
                >
                  {!logoBase64 ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                      Đang tải logo...
                    </>
                  ) : isCopied ? (
                    <>
                      <Check size={20} />
                      Đã copy!
                    </>
                  ) : (
                    <>
                      <Copy size={20} />
                      Copy HTML
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowEmailModal(false);
                    setIsCopied(false);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
