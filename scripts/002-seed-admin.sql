-- Remove all demo users
delete from users;

-- Insert admin account
insert into users (user_id, password, name, college, role)
values ('MDNADEEM', 'N@deem#2026!Hub', 'MD Nadeem', 'InnoveX', 'admin')
on conflict (user_id) do nothing;
