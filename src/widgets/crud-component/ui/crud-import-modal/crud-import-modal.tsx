import {Alert, Button, Descriptions, Flex, List, Modal, Typography} from "antd";
import {IImportReport} from "@/shared/types/import-export";

interface IProps {
  report: IImportReport | null;
  isApplying: boolean;
  onApply: () => void;
  onClose: () => void;
}

export default function CrudImportModal(props: IProps) {
  const report = props.report;
  const isPreview = report != null && !report.applied;
  const hasChanges = report != null && report.created + report.updated != 0;

  return (
    <Modal
      open={report != null}
      title={isPreview ? "Імпорт: перевірка файлу" : "Результат імпорту"}
      onCancel={props.onClose}
      mask={{closable: !props.isApplying}}
      closable={!props.isApplying}
      footer={isPreview ? (
        <Flex gap="small" justify="flex-end">
          <Button onClick={props.onClose} disabled={props.isApplying}>Відмінити</Button>
          <Button type="primary" onClick={props.onApply} loading={props.isApplying} disabled={!hasChanges}>
            Імпортувати
          </Button>
        </Flex>
      ) : (
        <Button type="primary" onClick={props.onClose}>Закрити</Button>
      )}
    >
      {report && (
        <Flex vertical gap="middle">
          <Descriptions
            size="small"
            column={1}
            bordered
            items={[
              {key: "total", label: "Записів у файлі", children: report.total},
              {key: "created", label: isPreview ? "Буде створено" : "Створено", children: report.created},
              {key: "updated", label: isPreview ? "Буде оновлено" : "Оновлено", children: report.updated},
              {key: "errors", label: "З помилками", children: report.errors.length},
            ]}
          />
          {isPreview && hasChanges && (
            <Typography.Text type="secondary">
              Існуючі записи (з тим самим id або шляхом) будуть перезаписані даними з файлу.
              Записи з помилками буде пропущено.
            </Typography.Text>
          )}
          {report.warnings.map((warning) => (
            <Alert key={warning} type="warning" showIcon title={warning}/>
          ))}
          {report.errors.length != 0 && (
            <List
              size="small"
              bordered
              style={{maxHeight: 240, overflowY: "auto"}}
              dataSource={report.errors}
              renderItem={(error) => (
                <List.Item>
                  <Typography.Text>
                    <Typography.Text strong>Рядок {error.row}{error.name ? ` (${error.name})` : ""}:</Typography.Text>
                    {" "}
                    <Typography.Text type="danger">{error.message}</Typography.Text>
                  </Typography.Text>
                </List.Item>
              )}
            />
          )}
        </Flex>
      )}
    </Modal>
  )
}
