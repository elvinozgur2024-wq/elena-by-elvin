-- The admin Mesajlar page lets admins mark contact messages read/unread and
-- delete them. 0002 only granted admins SELECT; without these policies the
-- update/delete actions are silently rejected by RLS.
create policy "contact_messages_admin_update" on contact_messages
  for update using (public.is_admin());

create policy "contact_messages_admin_delete" on contact_messages
  for delete using (public.is_admin());
