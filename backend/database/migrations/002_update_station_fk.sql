ALTER TABLE station DROP CONSTRAINT fk_console;

ALTER TABLE station
ADD CONSTRAINT fk_console 
FOREIGN KEY (id_console) REFERENCES console(id_console)
ON DELETE RESTRICT;