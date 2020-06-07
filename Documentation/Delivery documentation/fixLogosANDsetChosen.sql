update garage set logo='laser-paints-logo.jpg' where lower(logo) like '%laser%';
update garage set logo='Amazona-logo.jpg' where lower(logo) like '%amazona%';
update garage set logo='andy-logo.jpg' where lower(logo) like '%andy%';
update garage set logo='king-logo.jpg' where lower(logo) like '%king%';
update garage set logo='alphalux-logo.jpg' where lower(logo) like '%alphalux%';
update garage set logo='Mariner-logo.jpg' where lower(logo) like '%mariner%';
update garage set logo='starlux 2 k - logo.png' where lower(logo) like '%starlux%';
update garage set logo='SC Paints.jpg' where lower(logo) like '%sc paints%';

update garage set chosen='0';
commit;
