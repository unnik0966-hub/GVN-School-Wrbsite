/* Update contact address to Othakalmandapam, Coimbatore – 641032 */
update public.site_content
set content = jsonb_set(
                jsonb_set(
                  content,
                  '{address}',
                  '"Othakalmandapam, Coimbatore – 641032"'
                ),
                '{map_embed}',
                '"https://www.google.com/maps?q=Othakalmandapam,Coimbatore+641032&output=embed"'
              ),
    updated_at = now()
where content_key = 'contact';
